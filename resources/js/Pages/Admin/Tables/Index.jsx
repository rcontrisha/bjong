import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Index() {
    const { tables, flash } = usePage().props;

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Tables" }
                ]}
            />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage QR Code (Meja)</h1>
                <Link
                    href={route("admin.tables.create")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Tambah Meja
                </Link>
            </div>

            {flash?.success && (
                <div className="p-3 bg-green-100 text-green-800 rounded mb-4">
                    {flash.success}
                </div>
            )}

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border">#</th>
                            <th className="p-3 border">Nomor Meja</th>
                            <th className="p-3 border">Area</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">QR Code</th>
                            <th className="p-3 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.length > 0 ? (
                            tables.map((table, i) => (
                                <tr key={table.id} className="border-b">
                                    <td className="p-3 border">{i + 1}</td>
                                    <td className="p-3 border">{table.table_number}</td>
                                    <td className="p-3 border capitalize">{table.area}</td>
                                    <td className="p-3 border">{table.status}</td>
                                    <td className="p-3 border">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + table.qr_code_url)}`}
                                            alt="QR"
                                            className="w-20 h-20"
                                        />
                                    </td>
                                    <td className="p-3 border space-x-2">
                                        <Link
                                            href={route("admin.tables.edit", table.id)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            as="button"
                                            method="post"
                                            href={route("admin.tables.regenerate", table.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Regenerate
                                        </Link>
                                        <Link
                                            as="button"
                                            method="delete"
                                            href={route("admin.tables.destroy", table.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Hapus
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-3 text-center text-gray-500">
                                    Belum ada data meja.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
