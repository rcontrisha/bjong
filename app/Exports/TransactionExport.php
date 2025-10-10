<?php

namespace App\Exports;

use App\Models\Order;
use App\Models\Category;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class TransactionExport implements FromView
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function view(): View
    {
        $query = Order::query()->with(['table', 'user', 'items.menuItem.category']);

        if (!empty($this->filters['tanggal_awal']) && !empty($this->filters['tanggal_akhir'])) {
            $query->whereBetween('created_at', [
                $this->filters['tanggal_awal'] . ' 00:00:00',
                $this->filters['tanggal_akhir'] . ' 23:59:59'
            ]);
        }

        if (!empty($this->filters['metode_pembayaran'])) {
            $query->where('payment_method', $this->filters['metode_pembayaran']);
        }

        if (!empty($this->filters['kategori'])) {
            $query->whereHas('items.menuItem.category', function ($q) {
                $q->where('id', $this->filters['kategori']);
            });
        }

        if (!empty($this->filters['shift'])) {
            $query->where('shift_id', $this->filters['shift']);
        }

        return view('exports.transactions', [
            'orders' => $query->latest()->get()
        ]);
    }
}
