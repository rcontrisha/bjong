import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ shiftAccounts }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Akun Shift</h1>
                <Link
                    href={route("admin.shift-accounts.create")}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    + Tambah Akun
                </Link>
            </div>

            {flash.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {flash.success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Nama Shift</th>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shiftAccounts.data.map((shift) => (
                            <tr key={shift.id} className="border-t">
                                <td className="p-3">{shift.shift_name}</td>
                                <td className="p-3">{shift.username}</td>
                                <td className="p-3 flex gap-2">
                                    <Link
                                        href={route(
                                            "admin.shift-accounts.edit",
                                            shift.id
                                        )}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            confirm("Hapus akun ini?") &&
                                            router.delete(
                                                route(
                                                    "admin.shift-accounts.destroy",
                                                    shift.id
                                                )
                                            )
                                        }
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
