<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menu_items';
    
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'base_price',
        'has_variants',
        'image',
        'availability'
    ];

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;

        // Pastikan path absolut, biar ga ketarik prefix /admin
        return asset('storage/' . ltrim($this->image, '/'));
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variantPrices()
    {
        return $this->hasMany(ItemVariantPrice::class);
    }

    // Accessor untuk mendapatkan harga minimum jika ada varian
    public function getMinPriceAttribute()
    {
        if ($this->has_variants && $this->variantPrices->count() > 0) {
            return $this->variantPrices->min('price');
        }
        return $this->base_price;
    }
}