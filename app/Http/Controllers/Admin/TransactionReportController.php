<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Category;
use App\Models\ShiftAccount;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TransactionExport;

class TransactionReportController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['tanggal_awal', 'tanggal_akhir', 'metode_pembayaran', 'kategori', 'shift']);

        $query = Order::query()->with(['table', 'items.menuItem.category', 'user']);

        // Filter tanggal (range)
        if ($request->filled('tanggal_awal') && $request->filled('tanggal_akhir')) {
            $query->whereBetween('created_at', [
                $request->tanggal_awal . ' 00:00:00',
                $request->tanggal_akhir . ' 23:59:59'
            ]);
        } elseif ($request->filled('tanggal_awal')) {
            $query->whereDate('created_at', '>=', $request->tanggal_awal);
        } elseif ($request->filled('tanggal_akhir')) {
            $query->whereDate('created_at', '<=', $request->tanggal_akhir);
        }

        // Filter metode pembayaran
        if ($request->filled('metode_pembayaran')) {
            $query->where('payment_method', $request->metode_pembayaran);
        }

        // Filter kategori
        if ($request->filled('kategori')) {
            $query->whereHas('items.menuItem.category', function ($q) use ($request) {
                $q->where('id', $request->kategori);
            });
        }

        // Filter shift
        if ($request->filled('shift')) {
            $query->where('shift_id', $request->shift);
        }

        // Ambil data untuk summary dan paginasi
        $ordersForSummary = (clone $query)->get();
        $orders = (clone $query)->latest()->paginate(10);

        $totalTransactions = $ordersForSummary->count();
        $totalRevenue = $ordersForSummary->sum('total_amount');

        // Hitung average per transaksi
        $averagePerTransaction = $totalTransactions > 0 
            ? round($totalRevenue / $totalTransactions, 2) 
            : 0.00;
        
        // Hitung data untuk chart Penjualan per Kategori
        $categorySales = Category::withCount(['menuItems as total_sold' => function($q) use ($ordersForSummary) {
            $q->join('order_items', 'menu_items.id', '=', 'order_items.menu_item_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereIn('orders.id', $ordersForSummary->pluck('id'));
        }])->get();

        // Hitung data untuk chart Rasio Penjualan Berdasarkan Metode Pembayaran
        $paymentSales = $ordersForSummary
            ->groupBy('payment_method')
            ->map(fn($items, $key) => [
                'count' => $items->count(),           // jumlah transaksi
                'totalAmount' => $items->sum('total_amount'), // total pendapatan
            ])
            ->toArray();
        
        return Inertia::render('Admin/Reports/Transactions', [
            'orders' => $orders,
            'filters' => $filters,
            'paymentMethods' => Order::select('payment_method')->distinct()->pluck('payment_method'),
            'categories' => Category::all(),
            'shifts' => ShiftAccount::all(),
            'summary' => [
                'totalTransactions' => $totalTransactions,
                'totalRevenue' => $totalRevenue,
                'averagePerTransaction' => $averagePerTransaction,
            ],
            'charts' => [
                'categorySales' => $categorySales->map(fn($c) => [
                    'name' => $c->name,
                    'value' => $c->total_sold,
                ]),
                'paymentSales' => $paymentSales,
            ],
        ]);
    }
    
    // 🧾 === EXPORT EXCEL FUNCTION ===
    public function exportExcel(Request $request)
    {
        $filters = $request->only(['tanggal_awal', 'tanggal_akhir', 'metode_pembayaran', 'kategori', 'shift']);
        $filename = 'Laporan_Transaksi_' . now()->format('Ymd_His') . '.xlsx';
        return Excel::download(new TransactionExport($filters), $filename);
    }
}
