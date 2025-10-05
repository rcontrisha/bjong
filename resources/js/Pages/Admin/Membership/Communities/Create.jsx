import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        contact_name: "",
        contact_phone: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.communities.store"));
    };

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Membership", href: "#" },
                    { label: "Komunitas", href: route("admin.communities.index") },
                    { label: "Tambah" },
                ]}
            />

            <h1 className="text-xl font-bold mb-6">Tambah Komunitas</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >
                <div>
                    <label className="block font-medium">Nama Komunitas</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Penanggungjawab</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.contact_name}
                        onChange={(e) =>
                            setData("contact_name", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="block font-medium">No. Telepon</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.contact_phone}
                        onChange={(e) =>
                            setData("contact_phone", e.target.value)
                        }
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Simpan
                    </button>
                    <Link
                        href={route("admin.communities.index")}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
