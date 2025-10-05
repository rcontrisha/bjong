<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableMonitoringController extends Controller
{
    // Halaman utama (render + data meja)
    public function page()
    {
        $tables = Table::with(['activeOrders.items'])->get();

        $data = $tables->map(function ($table) {
            return [
                'id'           => $table->id,
                'table_number' => $table->table_number,
                'area'         => $table->area,
                'label'        => ucfirst($table->area) . '-' . $table->table_number,
                'status'       => $table->activeOrders->count() > 0 ? 'occupied' : 'empty',
                'orders'       => $table->activeOrders,
            ];
        });

        return Inertia::render('Staf/Tables', [
            'tables'  => $data,
            'flash'   => session('success'),
        ]);
    }

    // Update status meja → redirect ke page
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $table = Table::findOrFail($id);
        $table->status = $request->status;
        $table->save();

        return redirect()->route('pos.tables.page')
            ->with('success', "Status meja {$table->label} berhasil diperbarui ✅");
    }
}
