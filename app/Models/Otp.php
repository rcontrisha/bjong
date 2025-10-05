<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor',
        'otp',
        'waktu',
    ];

    public $timestamps = true; // karena di migration ada timestamps()

    /**
     * Cek apakah OTP masih valid (belum expired).
     *
     * @param int $validSeconds jumlah detik valid (default 300 detik / 5 menit)
     * @return bool
     */
    public function isValid(int $validSeconds = 300): bool
    {
        return (time() - $this->waktu) <= $validSeconds;
    }
}
