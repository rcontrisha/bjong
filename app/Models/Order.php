<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\OrderItem;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'community_id',
        'shift_id',
        'table_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'midtrans_order_id',
        'midtrans_snap_token',
    ];

    /**
     * Relasi ke user (bisa null untuk guest)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke order_items
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    /**
     * Relasi ke komunitas (bisa null jika bukan order komunitas)
     */
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Cek apakah order untuk guest
     */
    public function isGuest()
    {
        return is_null($this->user_id);
    }
}
