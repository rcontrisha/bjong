<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();

            // Nomor telepon (wajib)
            $table->string('nomor', 20);

            // Kode OTP (4 digit atau 6 digit)
            $table->string('otp', 6);

            // Waktu simpan OTP (epoch time / unix timestamp)
            $table->unsignedBigInteger('waktu');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
