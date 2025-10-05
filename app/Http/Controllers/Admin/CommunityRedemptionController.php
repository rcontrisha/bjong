<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommunityRedemptionController extends Controller
{
    // Request pencairan poin
    public function store(Request $request, Community $community)
    {
        $data = $request->validate([
            'points_used'     => 'required|integer|min:1',
            'amount_received' => 'required|numeric',
        ]);

        if ($community->points < $data['points_used']) {
            return back()->with('error', 'Poin tidak mencukupi');
        }

        $data['requested_by'] = Auth::id();
        $data['status'] = 'pending';

        $community->redemptions()->create($data);

        $community->decrement('points', $data['points_used']);

        return back()->with('success', 'Pengajuan pencairan berhasil dibuat');
    }

    // Update status pencairan (admin approval)
    public function update(Request $request, Community $community, CommunityRedemption $redemption)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $redemption->update($data);

        return back()->with('success', 'Status pencairan diperbarui');
    }
}
