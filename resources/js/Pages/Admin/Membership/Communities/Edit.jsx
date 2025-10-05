import React from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit() {
    const { community } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: community.name || "",
        contact_name: community.contact_name || "",
        contact_phone: community.contact_phone || "",
        status: community.status || "active",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.communities.update", community.id));
    };

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Membership", href: "#" },
                    { label: "Komunitas", href: route("admin.communities.index") },
                    { label: "Edit" },
                ]}
            />

            <h1 className="text-xl font-bold mb-6">Edit Komunitas</h1>

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

                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        className="w-full border rounded p-2"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                    >
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Update
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
