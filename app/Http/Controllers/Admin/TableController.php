<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Table;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TableController extends Controller
{
    // Tampilkan semua meja
    public function index()
    {
        $tables = Table::all();
        return inertia('Admin/Tables/Index', compact('tables'));
    }

    // Form tambah
    public function create()
    {
        return inertia('Admin/Tables/Create');
    }

    // Simpan meja baru + generate QR
    public function store(Request $request)
    {
        $request->validate([
            'table_number' => [
                'required',
                Rule::unique('tables')->where(function ($query) use ($request) {
                    return $query->where('area', $request->area);
                }),
            ],
            'area' => 'required|in:depan,belakang',
        ]);

        $token = Str::random(16);

        $table = Table::create([
            'table_number' => $request->table_number,
            'area'         => $request->area,
            'qr_code_url'  => '/customer?token=' . $token,
            'qr_token'     => $token,
            'status'       => 'active',
        ]);

        return redirect()->route('admin.tables.index')->with('success', 'Meja berhasil ditambahkan!');
    }

    // Edit meja
    public function edit(Table $table)
    {
        return inertia('Admin/Tables/Edit', compact('table'));
    }

    // Update meja
    public function update(Request $request, Table $table)
    {
        $request->validate([
            'table_number' => [
                'required',
                Rule::unique('tables')->ignore($table->id)->where(function ($query) use ($request) {
                    return $query->where('area', $request->area);
                }),
            ],
            'area' => 'required|in:depan,belakang',
        ]);

        $table->update([
            'table_number' => $request->table_number,
            'area'         => $request->area,
            'status'       => $request->status ?? $table->status,
        ]);

        return redirect()->route('admin.tables.index')->with('success', 'Meja berhasil diperbarui!');
    }

    // Regenerate QR code
    public function regenerate(Table $table)
    {
        $token = Str::random(16);

        $table->update([
            'qr_token'    => $token,
            'qr_code_url' => '/customer?token=' . $token,
        ]);

        return redirect()->route('admin.tables.index')->with('success', 'QR Code berhasil diperbarui!');
    }

    // Hapus meja
    public function destroy(Table $table)
    {
        $table->delete();
        return redirect()->route('admin.tables.index')->with('success', 'Meja berhasil dihapus!');
    }
}
