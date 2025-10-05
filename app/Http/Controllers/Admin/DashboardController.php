<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_sales' => 125000000,
            'orders_count' => 350,
            'products_count' => 120,
            'customers_count' => 80,
        ];

        $salesData = [
            ['day' => 'Sen', 'total' => 1200000],
            ['day' => 'Sel', 'total' => 1800000],
            ['day' => 'Rab', 'total' => 900000],
            ['day' => 'Kam', 'total' => 2200000],
            ['day' => 'Jum', 'total' => 1700000],
        ];

        $ordersByCategory = [
            ['name' => 'Makanan', 'value' => 120],
            ['name' => 'Minuman', 'value' => 80],
            ['name' => 'Snack', 'value' => 40],
        ];

        $recentOrders = [
            ['id' => 101, 'customer' => 'Andi', 'total' => 50000, 'status' => 'Selesai'],
            ['id' => 102, 'customer' => 'Budi', 'total' => 75000, 'status' => 'Proses'],
            ['id' => 103, 'customer' => 'Citra', 'total' => 65000, 'status' => 'Pending'],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'salesData' => $salesData,
            'ordersByCategory' => $ordersByCategory,
            'recentOrders' => $recentOrders,
        ]);
    }
}
