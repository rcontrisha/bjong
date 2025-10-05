<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\ItemVariantPrice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with(['category', 'variantPrices']);

        // filter kategori
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // search by nama
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $menuItems = $query->paginate(10)->withQueryString();

        $categories = Category::all();

        return Inertia::render('Admin/MenuItems/Index', [
            'menuItems' => $menuItems,
            'categories' => $categories,
            'filters'   => $request->only(['category', 'search']), // kirim ke frontend
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Admin/MenuItems/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'base_price' => 'nullable|numeric',
            'has_variants' => 'boolean',
            'variants' => 'array'
        ]);

        $menuItem = MenuItem::create($data);

        if ($request->has_variants && $request->variants) {
            foreach ($request->variants as $variant) {
                ItemVariantPrice::create([
                    'menu_item_id' => $menuItem->id,
                    'name' => $variant['name'],
                    'price' => $variant['price'],
                ]);
            }
        }

        return redirect()->route('admin.menu-items.index')->with('success', 'Menu berhasil ditambahkan!');
    }

    public function edit(MenuItem $menuItem)
    {
        $menuItem->load('variantPrices');
        $categories = Category::all();

        return Inertia::render('Admin/MenuItems/Edit', [
            'menuItem' => $menuItem,
            'categories' => $categories,
        ]);
    }

    // UPDATE method ini
    public function update(Request $request, MenuItem $menuItem)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'base_price' => 'nullable|numeric',
            'has_variants' => 'boolean',
            'variants' => 'array',
            'image' => 'nullable|image|max:2048' // Tambah validasi gambar
        ]);

        // Handle file upload
        if ($request->file('image')) {
            // Hapus gambar lama jika ada
            if ($menuItem->image) {
                Storage::disk('public')->delete($menuItem->image);
            }
            $data['image'] = $request->file('image')->store('menu_images', 'public');
        }

        $menuItem->update($data);

        // hapus & update variant prices
        $menuItem->variantPrices()->delete();
        if ($request->has_variants && $request->variants) {
            foreach ($request->variants as $variant) {
                if (!empty($variant['variant_combination']) && !empty($variant['price'])) {
                    ItemVariantPrice::create([
                        'menu_item_id' => $menuItem->id,
                        'variant_combination' => $variant['variant_combination'],
                        'price' => $variant['price'],
                    ]);
                }
            }
        }

        return redirect()->route('admin.menu-items.index')->with('success', 'Menu berhasil diperbarui!');
    }


    // UPDATE method ini
    public function destroy(MenuItem $menuItem)
    {
        // Hapus gambar dari storage
        if ($menuItem->image) {
            Storage::disk('public')->delete($menuItem->image);
        }

        $menuItem->variantPrices()->delete();
        $menuItem->delete();

        return redirect()->route('admin.menu-items.index')->with('success', 'Menu berhasil dihapus!');
    }

    public function toggleAvailability(MenuItem $menuItem)
    {
        $menuItem->availability = !$menuItem->availability;
        $menuItem->save();

        return back()->with('success', 'Ketersediaan menu diperbarui.');
    }
}
