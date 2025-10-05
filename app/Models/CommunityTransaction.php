<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_id',
        'order_id',
        'points',
        'percentage',
        'description',
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
