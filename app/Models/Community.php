<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_name',
        'contact_phone',
        'points',
        'status',
        'created_by',
        'approval_status',
        'referral_code',
    ];

    // Anggota komunitas
    public function members()
    {
        return $this->hasMany(CommunityMember::class);
    }

    // Transaksi poin
    public function transactions()
    {
        return $this->hasMany(CommunityTransaction::class);
    }

    // Pencairan poin
    public function redemptions()
    {
        return $this->hasMany(CommunityRedemption::class);
    }

    // User yang bikin komunitas
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
