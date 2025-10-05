<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'name' => 'Admin Marketing',
            'email' => 'marketingbjong@example.com',
            'phone' => '081234567890',
            'password' => Hash::make('marketingbjong'),
            'role' => 'marketing', // bisa diganti: marketing / finance / operation
        ]);
    }
}
