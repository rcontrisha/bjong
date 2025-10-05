<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Community;
use App\Models\CommunityMember;

class CommunityController extends Controller
{
    // Tampilkan daftar komunitas user
    public function index(Request $request)
    {
        $communities = $request->user()
            ->communities()
            ->withCount('members') // jumlah member
            ->get(); // jangan pakai select() manual

        return Inertia::render('Customer/MyCommunities', [
            'auth' => ['user' => $request->user()],
            'communities' => $communities,
        ]);
    }

    // Form pengajuan komunitas baru
    public function applyForm(Request $request)
    {
        return Inertia::render('Customer/CommunityApply', [
            'auth' => ['user' => $request->user()],
        ]);
    }

    // Submit pengajuan komunitas
    public function apply(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
        ]);

        // Buat komunitas baru
        $community = Community::create([
            'name' => $request->name,
            'created_by' => $request->user()->id,
            'status' => 'inactive',           // belum aktif
            'approval_status' => 'pending',   // nunggu approval admin
            'contact_name' => $request->user()->name,
            'contact_phone' => $request->user()->phone,
        ]);

        // Catat user sebagai calon owner
        CommunityMember::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        return redirect()
            ->route('customer.communities.index')
            ->with('success', 'Pengajuan komunitas berhasil, tunggu approval kafe.');
    }

    // Tampilkan detail komunitas
    public function show(Request $request, Community $community)
    {
        $userId = $request->user()->id;

        // pastikan user ini anggota komunitas
        $isMember = CommunityMember::where('community_id', $community->id)
            ->where('user_id', $userId)
            ->exists();

        if (!$isMember) {
            abort(403, "Anda bukan anggota komunitas ini.");
        }

        return Inertia::render('Customer/CommunityDetail', [
            'auth' => ['user' => $request->user()],
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'status' => $community->status,
                'approval_status' => $community->approval_status,
                'contact_name' => $community->contact_name,
                'contact_phone' => $community->contact_phone,
                'points' => $community->points ?? 0,
                'members_count' => $community->members()->count(),
            ],
        ]);
    }

    public function join(Request $request)
    {
        $request->validate(['referral_code' => 'required|string']);

        // Logic cari komunitas dari referral code
        $community = Community::where('referral_code', $request->referral_code)->firstOrFail();

        // Tambah user ke komunitas
        CommunityMember::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return redirect()->route('customer.communities.index')
            ->with('success', 'Berhasil gabung komunitas!');
    }
}
