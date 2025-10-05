<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\Category;
use App\Models\CommunityTransaction;
use App\Models\CommunityRedemption;

class ReportingShiftController extends Controller
{
    // Halaman shift aktif
    public function index(Request $request)
    {
        $shift = session('shift_auth');
        if (!$shift) {
            return redirect()->route('pos.login')->with('error', 'Shift belum login.');
        }

        $today = now()->toDateString();

        // Ambil semua order paid shift hari ini
        $orders_query = Order::where('shift_id', $shift['id'])
            ->where('status', 'paid')
            ->whereDate('created_at', $today);

        $orders_data = $orders_query->with('items')->get(); // Jalankan query

        $total_orders = $orders_data->count();
        $total_amount = $orders_data->sum('total_amount');
        $avg_per_order = $total_orders ? $total_amount / $total_orders : 0;

        // Total items sold
        $total_items_sold = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.shift_id', $shift['id'])
            ->where('orders.status', 'paid')
            ->whereDate('orders.created_at', $today)
            ->sum('order_items.quantity');

        // Top 5 item terlaris
        $items_sold = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.shift_id', $shift['id'])
            ->where('orders.status', 'paid')
            ->whereDate('orders.created_at', $today)
            ->groupBy('order_items.name')
            ->selectRaw('order_items.name, SUM(order_items.quantity) as total_qty')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // Sales per category
        $category_sales = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('menu_items', 'menu_items.id', '=', 'order_items.menu_item_id')
            ->join('categories', 'categories.id', '=', 'menu_items.category_id')
            ->where('orders.shift_id', $shift['id'])
            ->where('orders.status', 'paid')
            ->whereDate('orders.created_at', $today)
            ->groupBy('categories.name')
            ->selectRaw('categories.name, SUM(order_items.quantity) as total_qty, SUM(order_items.subtotal) as total_amount')
            ->get();

        // Payment summary
        $payment_summary = $orders_data->groupBy('payment_method')
            ->map(fn($group) => [
                'payment_method' => $group->first()->payment_method,
                'count' => $group->count(),
                'total' => $group->sum('total_amount'),
            ])->values();

        // Community / loyalty
        $community_ids = $orders_data->pluck('community_id')->filter()->unique();

        $points_collected = CommunityTransaction::whereDate('created_at', $today)
            ->whereIn('community_id', $community_ids)
            ->sum('points');

        $redemptions_approved = CommunityRedemption::whereDate('created_at', $today)
            ->where('status', 'approved')
            ->sum('amount_received');

        // Kirim ke Inertia
        return Inertia::render('Staf/Reporting', [
            'shift' => $shift,
            'total_orders' => $total_orders,
            'total_amount' => $total_amount,
            'avg_per_order' => $avg_per_order,
            'total_items_sold' => $total_items_sold,
            'items_sold' => $items_sold->toArray(),
            'category_sales' => $category_sales->toArray(),
            'payment_summary' => $payment_summary->toArray(),
            'points_collected' => $points_collected,
            'redemptions_approved' => $redemptions_approved,
            'orders' => $orders_data->map(fn($o) => [
                'id' => $o->id,
                'guest_name' => $o->guest_name,
                'table_id' => $o->table_id,
                'total_amount' => $o->total_amount,
                'created_at' => $o->created_at->format('H:i:s'),
                'items' => $o->items->map(fn($i) => [
                    'name' => $i->name,
                    'quantity' => $i->quantity,
                    'subtotal' => $i->subtotal,
                ])->toArray(),
            ])->toArray(),
        ]);
    }

    // Tutup shift
    public function closeShift(Request $request)
    {
        $shift = session('shift_auth');
        if (!$shift) {
            return redirect()->route('pos.login')->with('error', 'Shift belum login.');
        }

        $total_amount = Order::where('shift_id', $shift['id'])
            ->where('status', 'paid')
            ->whereDate('created_at', now()->toDateString())
            ->sum('total_amount');

        $request->session()->forget('shift_auth');
        $request->session()->flash(
            'success',
            "Shift '{$shift['shift_name']}' ditutup. Total omzet hari ini: Rp " . number_format($total_amount)
        );

        return redirect()->route('pos.dashboard');
    }
}
