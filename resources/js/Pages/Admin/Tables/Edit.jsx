import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit({ table }) {
    const { data, setData, put, processing, errors } = useForm({
        table_number: table.table_number || "",
        area: table.area || "kasir",
        status: table.status || "active",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.tables.update", table.id));
    };

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Tables", href: route("admin.tables.index") },
                    { label: "Edit" }
                ]}
            />

            <h1 className="text-2xl font-bold mb-6">Edit Meja</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Nomor Meja</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.table_number}
                        onChange={(e) => setData("table_number", e.target.value)}
                    />
                    {errors.table_number && (
                        <p className="text-red-500 text-sm">{errors.table_number}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Area</label>
                    <select
                        className="w-full border rounded p-2"
                        value={data.area}
                        onChange={(e) => setData("area", e.target.value)}
                    >
                        <option value="depan">Depan</option>
                        <option value="belakang">Belakang</option>
                    </select>
                    {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Status</label>
                    <select
                        className="w-full border rounded p-2"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Update
                    </button>
                    <Link
                        href={route("admin.tables.index")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
