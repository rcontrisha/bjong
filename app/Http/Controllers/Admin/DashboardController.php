<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $periode = $request->get('periode', 'bulan_ini');

        // === Filter global query ===
        $orderQuery = Order::whereIn('payment_status', ['paid', 'settlement']);
        $this->applyPeriodeFilter($orderQuery, $periode);

        // === Statistik utama ===
        $stats = [
            'total_sales'       => (clone $orderQuery)->sum('total_amount'),
            'orders_count'      => (clone $orderQuery)->count(),
            'products_count'    => OrderItem::whereHas('order', function ($q) use ($periode) {
                                        $q->whereIn('payment_status', ['paid', 'settlement']);
                                        $this->applyPeriodeFilter($q, $periode);
                                    })
                                    ->sum('quantity'),
            'transaction_ratio' => $this->getTransactionRatio($periode),
        ];

        // === Tren Penjualan ===
        $salesData = (clone $orderQuery)
            ->selectRaw('DATE(created_at) as tanggal, SUM(total_amount) as total')
            ->groupBy('tanggal')
            ->orderByRaw('MIN(created_at) ASC')
            ->take(7)
            ->get()
            ->map(fn($item) => [
                'day' => date('d M', strtotime($item->tanggal)),
                'total' => (int) $item->total,
            ]);

        Log::info('📈 Sales Data Debug', [
            'periode' => $periode,
            'salesData_raw' => $salesData->toArray(),
        ]);

        // === Produk Terlaris ===
        $ordersByProduct = OrderItem::with(['menuItem', 'order'])
            ->whereHas('order', function ($q) use ($periode) {
                $q->whereIn('payment_status', ['paid', 'settlement']);
                $this->applyPeriodeFilter($q, $periode);
            })
            ->selectRaw('menu_item_id, SUM(quantity) as total_qty')
            ->groupBy('menu_item_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name'  => optional($item->menuItem)->name ?? 'Tidak Diketahui',
                'value' => (int) $item->total_qty,
            ]);

        if ($ordersByProduct->isEmpty()) {
            Log::warning('⚠️ Tidak ada data produk terlaris.', ['periode' => $periode]);
            $ordersByProduct = collect([['name' => 'Belum Ada Data', 'value' => 1]]);
        }

        // === Pesanan Terbaru ===
        $recentOrders = (clone $orderQuery)
            ->with('table') // Relasi ke tabel meja
            ->latest()
            ->take(5)
            ->get(['id', 'guest_name', 'table_id', 'total_amount', 'payment_status'])
            ->map(fn($o) => [
                'id'           => $o->id,
                'customer'     => $o->guest_name ?? 'Guest',
                'table_number' => optional($o->table)->table_number ?? '-',
                'total'        => (int) $o->total_amount,
                'status'       => ucfirst($o->payment_status),
            ]);

        Log::info('✅ Dashboard Loaded Successfully', [
            'stats' => $stats,
            'salesData_count' => $salesData->count(),
            'recentOrders_count' => $recentOrders->count(),
        ]);

        return Inertia::render('Admin/Dashboard', [
            'stats'            => $stats,
            'salesData'        => $salesData,
            'ordersByCategory' => $ordersByProduct,
            'recentOrders'     => $recentOrders,
            'periode'          => $periode,
        ]);
    }

    /**
     * Filter query berdasarkan periode
     */
    private function applyPeriodeFilter($query, $periode)
    {
        return $query
            ->when($periode === 'bulan_ini', fn($q) =>
                $q->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year))
            ->when($periode === 'bulan_lalu', fn($q) =>
                $q->whereMonth('created_at', now()->subMonth()->month)
                  ->whereYear('created_at', now()->subMonth()->year))
            ->when($periode === 'tahun_ini', fn($q) =>
                $q->whereYear('created_at', now()->year));
    }

    /**
     * Rasio metode pembayaran
     */
    private function getTransactionRatio($periode)
    {
        $query = Order::query();
        $this->applyPeriodeFilter($query, $periode);

        $methods = $query
            ->whereIn('payment_status', ['paid', 'settlement'])
            ->selectRaw('payment_method, COUNT(*) as total')
            ->groupBy('payment_method')
            ->pluck('total', 'payment_method')
            ->toArray();

        $sum = array_sum($methods);
        if ($sum === 0) return '0% -';

        return collect($methods)
            ->map(fn($count, $method) => round(($count / $sum) * 100, 1) . "% $method")
            ->implode(' / ');
    }
}
