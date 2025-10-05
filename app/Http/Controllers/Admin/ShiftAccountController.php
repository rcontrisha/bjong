<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ShiftAccount;
use Illuminate\Support\Facades\Hash;

class ShiftAccountController extends Controller
{
    public function index()
    {
        $shiftAccounts = ShiftAccount::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/ShiftAccounts/Index', [
            'shiftAccounts' => $shiftAccounts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ShiftAccounts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shift_name' => 'required|string|max:100',
            'username'   => 'required|string|max:50|unique:shift_accounts,username',
            'password'   => 'required|string|min:6',
        ]);

        ShiftAccount::create([
            'shift_name' => $validated['shift_name'],
            'username'   => $validated['username'],
            'password'   => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.shift-accounts.index')->with('success', 'Akun shift berhasil dibuat.');
    }

    public function edit(ShiftAccount $shiftAccount)
    {
        return Inertia::render('Admin/ShiftAccounts/Edit', [
            'shiftAccount' => $shiftAccount,
        ]);
    }

    public function update(Request $request, ShiftAccount $shiftAccount)
    {
        $validated = $request->validate([
            'shift_name' => 'required|string|max:100',
            'username'   => 'required|string|max:50|unique:shift_accounts,username,' . $shiftAccount->id,
            'password'   => 'nullable|string|min:6',
        ]);

        $shiftAccount->update([
            'shift_name' => $validated['shift_name'],
            'username'   => $validated['username'],
            'password'   => $validated['password']
                ? Hash::make($validated['password'])
                : $shiftAccount->password,
        ]);

        return redirect()->route('admin.shift-accounts.index')->with('success', 'Akun shift berhasil diupdate.');
    }

    public function destroy(ShiftAccount $shiftAccount)
    {
        $shiftAccount->delete();

        return redirect()->route('admin.shift-accounts.index')->with('success', 'Akun shift berhasil dihapus.');
    }
}
