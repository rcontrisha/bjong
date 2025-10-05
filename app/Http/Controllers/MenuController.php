<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function show($id)
    {
        $menuItem = MenuItem::with(['category', 'variantPrices'])
            ->findOrFail($id);

        return Inertia::render('Customer/MenuDetail', [
            'menuItem' => $menuItem,
        ]);
    }
}