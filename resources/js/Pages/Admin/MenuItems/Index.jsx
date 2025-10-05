import React from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

function Index({ auth, menuItems, categories, filters }) {
    const handleDelete = (id) => {
        if (confirm("Yakin hapus menu ini?")) {
            router.delete(route("admin.menu-items.destroy", id));
        }
    };

    const toggleAvailability = (id) => {
        router.post(route("admin.menu-items.toggleAvailability", id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Kelola Menu & Produk</h1>
                <Link
                    href={route("admin.menu-items.create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                    + Tambah Menu
                </Link>
            </div>

            {/* Top Controls */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2">
                    <select
                        value={filters?.category || ""}
                        onChange={(e) =>
                            router.get(route("admin.menu-items.index"), {
                                ...filters,
                                category: e.target.value,
                            })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">Semua</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Cari menu..."
                        defaultValue={filters?.search || ""}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                router.get(route("admin.menu-items.index"), {
                                    ...filters,
                                    search: e.target.value,
                                });
                            }
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Gambar</th>
                            <th className="p-3">Nama</th>
                            <th className="p-3">Kategori</th>
                            <th className="p-3">Varian</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.data.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                            No Img
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 font-medium">{item.name}</td>
                                <td className="p-3">{item.category?.name || "-"}</td>
                                <td className="p-3">
                                    {item.has_variants
                                        ? `${item.variant_prices.length} varian`
                                        : "-"}
                                </td>
                                <td className="p-3">
                                    <div className="flex justify-center space-x-2">
                                        <Link
                                            href={route("admin.menu-items.show", item.id)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium"
                                        >
                                            Detail
                                        </Link>
                                        <Link
                                            href={route("admin.menu-items.edit", item.id)}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium"
                                        >
                                            Hapus
                                        </button>
                                        {/* Toggle Ketersediaan */}
                                        <div
                                            onClick={() => toggleAvailability(item.id)}
                                            className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
                                                item.availability ? "bg-green-500" : "bg-gray-400"
                                            }`}
                                        >
                                            <div
                                                className={`absolute bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 ${
                                                    item.availability ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

Index.layout = (page) => (
    <AdminLayout auth_admin={page.props.auth_admin}>{page}</AdminLayout>
);

export default Index;
