<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Table;
use App\Models\MenuItem;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->query('token');
        $tableNumber = null;

        if ($token) {
            // simpan token ke session
            $request->session()->put('table_token', $token);

            $table = Table::where('qr_token', $token)->first();
            $tableNumber = $table
                ? strtoupper($table->area) . '-' . $table->table_number
                : null;
        } else {
            // fallback: coba ambil dari session
            $token = $request->session()->get('table_token');
            if ($token) {
                $table = Table::where('qr_token', $token)->first();
                $tableNumber = $table
                    ? strtoupper($table->area) . '-' . $table->table_number
                    : null;
            }
        }

        $categories = Category::orderBy('name')->get();

        $menus = MenuItem::with('category', 'variantPrices')
            ->get()
            ->map(function ($menu) {
                $minVariantPrice = $menu->variantPrices->min('price');
                $basePrice = $menu->base_price ?? 0;
                $priceValue = $menu->has_variants
                    ? ($minVariantPrice ?? $basePrice)
                    : $basePrice;
                $priceDisplay = $menu->has_variants
                    ? "From " . number_format(($minVariantPrice ?? $basePrice) / 1000, 0) . "K"
                    : number_format($basePrice / 1000, 0) . "K";

                return [
                    'id'          => $menu->id,
                    'name'        => $menu->name,
                    'price'       => $priceDisplay,
                    'image'       => $menu->image,
                    'category'    => $menu->category->name ?? 'Uncategorized',
                    'description' => $menu->description,
                ];
            })
            ->toArray();

        $promos = [
            [
                'id'    => 1,
                'title' => 'Membership Komunitas',
                'desc'  => 'Setiap transaksi menambah poin komunitas, yang bisa dicairkan jadi uang tunai.'
            ],
        ];

        return Inertia::render('Dashboard', [
            'categories'  => $categories,
            'menus'       => $menus,
            'promos'      => $promos,
            'tableNumber' => $tableNumber,
        ]);
    }
}
