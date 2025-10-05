<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityTransaction;
use Illuminate\Http\Request;

class CommunityTransactionController extends Controller
{
    // Tambah transaksi poin (misalnya dari order)
    public function store(Request $request, Community $community)
    {
        $data = $request->validate([
            'order_id'   => 'nullable|exists:orders,id',
            'points'     => 'required|integer',
            'percentage' => 'nullable|numeric',
            'description'=> 'nullable|string',
        ]);

        $community->transactions()->create($data);

        // update saldo poin
        $community->increment('points', $data['points']);

        return back()->with('success', 'Transaksi poin berhasil dicatat');
    }
}
