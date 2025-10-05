<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityRedemption extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_id',
        'points_used',
        'amount_received',
        'status',
        'requested_by',
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
