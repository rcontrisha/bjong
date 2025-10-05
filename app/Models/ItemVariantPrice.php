<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemVariantPrice extends Model
{
    use HasFactory;

    protected $table = 'item_variant_prices';
    
    protected $fillable = [
        'menu_item_id',
        'variant_combination',
        'price'
    ];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}