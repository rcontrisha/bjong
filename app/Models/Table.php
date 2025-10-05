<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'area',
        'qr_code_url',
        'qr_token',
        'status',
    ];

    /**
     * Relasi ke orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'table_id');
    }

    /**
     * Order aktif (pending/paid)
     */
    public function activeOrders()
    {
        return $this->orders()->whereIn('status', ['pending', 'paid']);
    }
}
