<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    // List semua komunitas
    public function index()
    {
        // Ambil semua komunitas + hitung anggota
        $communities = Community::withCount('members')->get();
        return inertia('Admin/Membership/Communities/Index', compact('communities'));
    }

    // Form tambah komunitas
    public function create()
    {
        return inertia('Admin/Membership/Communities/Create');
    }

    // Simpan komunitas baru
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'contact_name'  => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        Community::create($data);

        return redirect()->route('admin.communities.index')->with('success', 'Komunitas berhasil ditambahkan');
    }

    // Detail komunitas
    public function show(Community $community)
    {
        $community->load('members.user', 'transactions', 'redemptions');
        return inertia('Admin/Membership/Communities/Show', compact('community'));
    }

    // Edit komunitas
    public function edit(Community $community)
    {
        return inertia('Admin/Membership/Communities/Edit', compact('community'));
    }

    // Update komunitas
    public function update(Request $request, Community $community)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'contact_name'  => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'status'        => 'required|in:active,inactive',
        ]);

        $community->update($data);

        return redirect()->route('admin.communities.index')->with('success', 'Komunitas berhasil diperbarui');
    }

    // Hapus komunitas
    public function destroy(Community $community)
    {
        $community->delete();
        return redirect()->route('admin.communities.index')->with('success', 'Komunitas berhasil dihapus');
    }

    // Approve komunitas
    public function approve(Community $community)
    {
        $generateReferralCode = function ($cafe, $communityName) {
            $prefix = strtoupper(substr($cafe, 0, 2)); // BJ

            // Ambil huruf awal tiap kata di nama komunitas
            $words = explode(' ', $communityName);
            $commPart = '';
            foreach ($words as $word) {
                $commPart .= strtoupper(substr($word, 0, 1));
            }

            // Maksimal 4 huruf dari nama komunitas
            $commPart = substr($commPart, 0, 4);

            // Hitung sisa karakter supaya total jadi 8
            $remainingLength = 8 - strlen($prefix) - strlen($commPart);

            do {
                $randomPart = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, $remainingLength);
                $code = $prefix . $commPart . $randomPart;
                $exists = Community::where('referral_code', $code)->exists();
            } while ($exists);

            return $code;
        };

        $referralCode = $generateReferralCode('Bjong', $community->name);

        $community->update([
            'status' => 'active',
            'approval_status' => 'approved',
            'referral_code' => $referralCode,
        ]);

        return redirect()->back()->with('success', "Komunitas '{$community->name}' telah disetujui. Referral Code: {$referralCode}");
    }

    // Reject komunitas
    public function reject(Community $community)
    {
        $community->update([
            'status' => 'inactive',
            'approval_status' => 'rejected',
        ]);

        return redirect()->back()->with('success', "Komunitas '{$community->name}' telah ditolak.");
    }
}
