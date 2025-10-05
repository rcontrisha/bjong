<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('name')->get();

        $menus = MenuItem::with('variantPrices')
            ->leftJoin('categories', 'menu_items.category_id', '=', 'categories.id')
            ->select(
                'menu_items.*',
                'categories.name as category_name'
            )
            ->get()
            ->map(function($item) {
                $basePrice = $item->has_variants
                    ? $item->variantPrices->min('price')
                    : $item->base_price;

                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (int) $basePrice,
                    'price_display' => $item->has_variants
                        ? 'From ' . number_format($basePrice / 1000, 0) . 'K'
                        : number_format($basePrice / 1000, 0) . 'K',
                    'category' => $item->category_name ?: 'Uncategorized',
                    'description' => $item->description,
                    'image' => 'https://source.unsplash.com/200x200/?' . urlencode($item->name),
                    'variants' => $item->variantPrices->map(fn($v) => [
                        'id' => $v->id,
                        'name' => $v->variant_combination,
                        'price' => (int) $v->price,
                    ])->toArray()
                ];
            })
            ->toArray();

        return Inertia::render('Staf/Dashboard', [
            'categories' => $categories,
            'menus' => $menus,
            'shift' => session('shift_auth'),
        ]);
    }

    // 🚀 Store transaksi
    public function storeTransaction(Request $request)
    {
        if (!$request->has('cart') || empty($request->cart)) {
            return redirect()
                ->route('pos.dashboard')
                ->with('error', 'Keranjang kosong, transaksi dibatalkan.');
        }

        $data = $request->validate([
            'total' => 'required|numeric',
            'cart'  => 'required|array|min:1',
            'cart.*.id'    => 'required',
            'cart.*.name'  => 'required|string',
            'cart.*.price' => 'required|numeric|min:0',
            'cart.*.qty'   => 'required|integer|min:1',
        ]);

        $shift = session('shift_auth');

        $order = Order::create([
            'shift_id'       => $shift['id'] ?? null,
            'total_amount'   => $data['total'],
            'status'         => 'paid',
            'payment_method' => 'cash',
            'payment_status' => 'settlement',
        ]);

        foreach ($data['cart'] as $item) {
            OrderItem::create([
                'order_id'           => $order->id,
                'menu_item_id'       => is_numeric($item['id']) ? $item['id'] : explode('-', $item['id'])[0],
                'name'               => $item['name'],
                'variant_combination'=> $item['variant'] ?? null,
                'price'              => $item['price'],
                'quantity'           => $item['qty'],
                'subtotal'           => $item['price'] * $item['qty'],
            ]);
        }

        return redirect()
            ->route('pos.dashboard')
            ->with('success', 'Transaksi berhasil disimpan!');
    }
}
