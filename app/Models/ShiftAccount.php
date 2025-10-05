<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShiftAccount extends Model
{
    use HasFactory;

    protected $table = 'shift_accounts';

    protected $fillable = [
        'shift_name',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}
