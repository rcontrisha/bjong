<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Midtrans\Snap;
use Midtrans\Config;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        // Ambil cart dari session
        $cartItems = session()->get('cart', []);
        $total = collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']);

        // Estimasi poin
        $estimatedPoints = $total / 10000;

        // Ambil user saat ini
        $user = Auth::user();

        // Ambil komunitas user (pakai relasi Eloquent)
        $communityId = $user?->communities->first()?->id ?? null;

        return Inertia::render('Customer/Cart', [
            'cartItems'       => $cartItems,
            'total'           => $total,
            'estimatedPoints' => $estimatedPoints,
            'auth' => [
                'user' => $user ? [
                    'id'           => $user->id,
                    'name'         => $user->name,
                    'email'        => $user->email,
                    'phone'        => $user->phone,
                    'community_id' => $communityId, // langsung pakai Eloquent
                ] : null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        Log::info('📥 Request data:', $request->all());

        $request->validate([
            'menu_item_id' => 'required',
            'name' => 'required|string',
            'variant_combination' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'image' => 'required|string'
        ]);

        $cart = session()->get('cart', []);
        $newItem = [
            'id' => uniqid(),
            'menu_item_id' => $request->menu_item_id,
            'name' => $request->name,
            'variant_combination' => $request->variant_combination,
            'quantity' => $request->quantity,
            'price' => $request->price,
            'image' => $request->image,
            'added_at' => now()->toDateTimeString()
        ];

        // Check if item already exists in cart
        $existingIndex = null;
        foreach ($cart as $index => $item) {
            if ($item['menu_item_id'] === $request->menu_item_id && 
                $item['variant_combination'] === $request->variant_combination) {
                $existingIndex = $index;
                break;
            }
        }

        if ($existingIndex !== null) {
            // Update quantity if item exists
            $cart[$existingIndex]['quantity'] += $request->quantity;
        } else {
            // Add new item to cart
            $cart[] = $newItem;
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('success', 'Item added to cart!');
    }

    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = session()->get('cart', []);

        foreach ($cart as $index => $item) {
            if ($item['id'] === $itemId) {
                $cart[$index]['quantity'] = $request->quantity;
                break;
            }
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('success', 'Cart updated!');
    }

    public function destroy($itemId)
    {
        $cart = session()->get('cart', []);
        $newCart = array_filter($cart, function ($item) use ($itemId) {
            return $item['id'] !== $itemId;
        });

        session()->put('cart', array_values($newCart));

        return redirect()->back()->with('success', 'Item removed from cart!');
    }

    public function clear()
    {
        session()->forget('cart');

        return redirect()->back()->with('success', 'Cart cleared!');
    }

    public function checkout(Request $request)
    {
        $cartItems = session()->get('cart', []);
        if (empty($cartItems)) {
            return response()->json(['error' => 'Keranjang kosong'], 400);
        }

        $total = collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']);

        $user = $request->user();
        $guestName = $request->input('name', 'Guest');
        $guestEmail = $request->input('email', 'guest@example.com');
        $guestPhone = $request->input('phone', '08123456789');

        DB::beginTransaction();
        try {
            // Buat order
            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'guest_name' => $user ? null : $guestName,
                'guest_email' => $user ? null : $guestEmail,
                'guest_phone' => $user ? null : $guestPhone,
                'total_amount' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'midtrans',
                'midtrans_order_id' => uniqid('ORD-'),
                'community_id' => $request->input('community_id') // kalau customer pakai komunitas
            ]);

            // Insert order items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'name' => $item['name'],
                    'variant_combination' => $item['variant_combination'] ?? null,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            // Konfigurasi Midtrans
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = false;
            Config::$isSanitized = true;
            Config::$is3ds = true;

            $transaction_details = [
                'order_id' => $order->midtrans_order_id,
                'gross_amount' => $total,
            ];

            $item_details = array_map(fn($item) => [
                'id' => $item['menu_item_id'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'name' => $item['name'],
            ], $cartItems);

            $customer_details = [
                'first_name' => $user ? $user->name : $guestName,
                'email' => $user ? $user->email : $guestEmail,
                'phone' => $user ? ($user->phone ?? '08123456789') : $guestPhone,
            ];

            $params = [
                'transaction_details' => $transaction_details,
                'item_details' => $item_details,
                'customer_details' => $customer_details,
                'notification_url' => route('customer.orders.notification'), // Midtrans callback
            ];

            // === LOG PAYLOAD DETAIL ===
            Log::debug('[Midtrans Checkout Payload]', [
                'order_id' => $order->id,
                'midtrans_order_id' => $order->midtrans_order_id,
                'params' => $params
            ]);

            // Generate Snap Token
            $snapToken = Snap::getSnapToken($params);

            // === LOG RESPONSE MIDTRANS ===
            Log::debug('[Midtrans Snap Response]', [
                'order_id' => $order->id,
                'snap_token' => $snapToken
            ]);

            // Simpan snap token ke order
            $order->update(['midtrans_snap_token' => $snapToken]);

            DB::commit();

            // Hapus cart session
            session()->forget('cart');

            return response()->json([
                'token' => $snapToken,
                'order_id' => $order->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('[Midtrans Checkout Error] ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Gagal melakukan checkout'], 500);
        }
    }

    public function repeatOrder(Request $request, $orderId)
    {
        $user = $request->user();

        $order = Order::with('items')
            ->where('user_id', $user->id)
            ->findOrFail($orderId);

        $cart = session()->get('cart', []);

        foreach ($order->items as $item) {
            $existingIndex = null;
            foreach ($cart as $index => $cartItem) {
                if ($cartItem['menu_item_id'] === $item->menu_item_id &&
                    $cartItem['variant_combination'] === $item->variant_combination) {
                    $existingIndex = $index;
                    break;
                }
            }

            if ($existingIndex !== null) {
                // Tambahin quantity kalau sudah ada di cart
                $cart[$existingIndex]['quantity'] += $item->quantity;
            } else {
                $cart[] = [
                    'id' => uniqid(),
                    'menu_item_id' => $item->menu_item_id,
                    'name' => $item->name,
                    'variant_combination' => $item->variant_combination,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'image' => $item->image ?? null,
                    'added_at' => now()->toDateTimeString(),
                ];
            }
        }

        session()->put('cart', $cart);

        return redirect()->route('customer.cart.index')
            ->with('success', 'Order berhasil ditambahkan ke cart!');
    }
}