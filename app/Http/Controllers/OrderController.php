<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use Midtrans\Config;
use Midtrans\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\CommunityTransaction;
use App\Models\Community;

class OrderController extends Controller
{
    /**
     * Riwayat pemesanan user
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $orders = Order::with(['items', 'user']) // <-- tambahin 'user'
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Customer/Riwayat', [
            'orders' => $orders,
            'auth' => ['user' => $user],
        ]);
    }

    /**
     * Detail order
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $order = Order::with(['items', 'user']) // <-- tambahin 'user'
            ->where('user_id', $user->id)
            ->findOrFail($id);

        return Inertia::render('Customer/RiwayatDetail', [
            'order' => $order,
            'auth' => ['user' => $user],
        ]);
    }

    /**
     * Handle Midtrans payment notification (callback)
     */
    public function notificationHandler(Request $request)
    {
        // Log payload awal
        Log::info('[Midtrans] Notification received', $request->all());

        DB::beginTransaction();
        try {
            // Set konfigurasi Midtrans
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = false;
            Config::$isSanitized = true;
            Config::$is3ds = true;

            // Buat instance Midtrans Notification
            $notification = new Notification();

            // Ambil order berdasarkan midtrans_order_id
            $orderId = $notification->order_id;
            $order = Order::with('items')->where('midtrans_order_id', $orderId)->first();

            if (!$order) {
                Log::warning("[Midtrans] Order not found for order_id: {$orderId}");
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Update status order berdasarkan transaction_status dari Midtrans
            switch ($notification->transaction_status) {
                case 'capture':
                case 'settlement':
                    $order->status = 'paid';
                    $order->payment_status = 'settlement';
                    Log::info("[Midtrans] Order #{$order->id} settled.");

                    // === Tambah poin komunitas kalau ada community_id ===
                    if ($order->community_id) {
                        $points = $order->total_amount / 10000; // jangan round

                        CommunityTransaction::create([
                            'community_id' => $order->community_id,
                            'order_id'     => $order->id,
                            'points'       => $points,
                            'percentage'   => 0, // rule fix (10rb = 1 poin)
                            'description'  => 'Reward poin dari order #' . $order->id,
                        ]);

                        Community::where('id', $order->community_id)
                            ->increment('points', $points);

                        Log::info("[Midtrans] Community #{$order->community_id} dapat {$points} poin dari order #{$order->id}");
                    }
                    break;

                case 'pending':
                    $order->status = 'pending';
                    $order->payment_status = 'pending';
                    Log::info("[Midtrans] Order #{$order->id} pending.");
                    break;

                case 'deny':
                case 'cancel':
                case 'expire':
                    $order->status = 'failed';
                    $order->payment_status = $notification->transaction_status;
                    Log::info("[Midtrans] Order #{$order->id} failed ({$notification->transaction_status}).");
                    break;

                default:
                    Log::warning("[Midtrans] Unhandled transaction status: {$notification->transaction_status} for order #{$order->id}");
                    break;
            }

            $order->save();
            DB::commit();

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('[Midtrans] Notification handler error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function summary(Request $request, $id)
    {
        $user = $request->user();

        $order = Order::with('items')
            ->where('id', $id)
            ->where(function ($q) use ($user) {
                if ($user) {
                    // kalau login → pastikan order memang punya dia
                    $q->where('user_id', $user->id);
                } else {
                    // kalau guest → order user_id harus null
                    $q->whereNull('user_id');
                }
            })
            ->firstOrFail();

        return Inertia::render('Customer/OrderSummary', [
            'order' => $order,
            'auth' => ['user' => $user],
        ]);
    }
}
