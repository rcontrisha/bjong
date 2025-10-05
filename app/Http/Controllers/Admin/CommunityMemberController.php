<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\User;
use Illuminate\Http\Request;

class CommunityMemberController extends Controller
{
    // Tambah anggota komunitas
    public function store(Request $request, Community $community)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role'    => 'nullable|string|max:50',
        ]);

        $data['joined_at'] = now();

        $community->members()->create($data);

        return back()->with('success', 'Anggota berhasil ditambahkan');
    }

    // Hapus anggota komunitas
    public function destroy(Community $community, CommunityMember $member)
    {
        $member->delete();
        return back()->with('success', 'Anggota berhasil dihapus');
    }
}
