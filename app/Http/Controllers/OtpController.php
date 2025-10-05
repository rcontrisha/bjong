<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OtpController extends Controller
{
    /**
     * Kirim OTP via WhatsApp (Fonnte).
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'nomor' => 'required|string|max:20',
        ]);

        $phone = $request->nomor;

        // hapus OTP lama
        Otp::where('nomor', $phone)->delete();

        // generate OTP
        $otpCode = rand(100000, 999999);

        // simpan ke DB
        $otp = Otp::create([
            'nomor' => $phone,
            'otp'   => $otpCode,
            'waktu' => time(),
        ]);

        // request ke Fonnte
        $response = Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN'),
        ])->asForm()->post('https://api.fonnte.com/send', [
            'target'  => $phone,
            'message' => "Kode OTP kamu adalah: {$otpCode}\n(Berlaku 1 menit)",
        ]);

        return back()->with([
            'step' => 2,
            'nomor' => $phone,
            'fonnte_response' => $response->json(),
        ]);
    }

    /**
     * Verifikasi OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'nomor' => 'required|string|max:20',
            'otp'   => 'required|string|max:6',
        ]);

        $phone = $request->nomor;
        $otpCode = $request->otp;

        $otp = Otp::where('nomor', $phone)
            ->where('otp', $otpCode)
            ->latest()
            ->first();

        if (!$otp) {
            return back()->withErrors(['otp' => 'Kode OTP salah atau sudah kadaluarsa']);
        }

        if (time() - $otp->waktu > 90) {
            return back()->withErrors(['otp' => 'Kode OTP salah atau sudah kadaluarsa']);
        }

        $user = User::firstOrCreate(
            ['phone' => $phone],
            ['name' => null, 'email' => null, 'password' => null]
        );

        Auth::login($user);
        $otp->delete();

        // Ambil token dari session
        $token = $request->session()->get('table_token');

        if ($token) {
            return redirect('/customer?token=' . $token)
                ->with('success', 'Login berhasil');
        }

        return redirect()->route('customer.dashboard')
            ->with('success', 'Login berhasil');
    }
}
