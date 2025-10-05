<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ShiftAccount;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Show Inertia login page
    public function showLoginForm()
    {
        return Inertia::render('Staf/Login');
    }

    // Handle login attempt
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username'     => 'required|string',
            'password'     => 'required|string',
        ]);

        $shift = ShiftAccount::where('username', $validated['username'])->first();

        if (!$shift || !Hash::check($validated['password'], $shift->password)) {
            return back()->withErrors(['username' => 'Username atau password salah'])->withInput();
        }

        // Simpan info shift di session (opening_cash disimpan di session)
        $request->session()->put('shift_auth', [
            'id'           => $shift->id,
            'username'     => $shift->username,
            'shift_name'   => $shift->shift_name,
        ]);

        $request->session()->flash('success', 'Login berhasil. Selamat bekerja.');

        return redirect()->route('pos.dashboard');
    }

    // Logout POS (hapus session)
    public function logout(Request $request)
    {
        $request->session()->forget('shift_auth');
        $request->session()->regenerateToken();

        return redirect()->route('pos.login');
    }
}
