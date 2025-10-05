import React from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

function Index({ auth, menuItems, categories, filters }) {
    const handleDelete = (id) => {
        if (confirm("Yakin hapus menu ini?")) {
            router.delete(route("admin.menu-items.destroy", id));
        }
    };

    const handleFilter = (e) => {
        router.get(route("admin.menu-items.index"), { category: e.target.value });
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
                {/* Filter kategori */}
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

                    {/* Search bar */}
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

                {/* Pagination */}
                <div className="flex space-x-2">
                    {menuItems.links.map((link, index) => {
                        let label = link.label;
                        if (label.includes("pagination.previous")) label = "« Previous";
                        if (label.includes("pagination.next")) label = "Next »";

                        return (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-3 py-1 rounded text-sm ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                } ${!link.url ? "pointer-events-none opacity-50" : ""}`}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
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
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
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

Index.layout = (page) => <AdminLayout auth={page.props.auth}>{page}</AdminLayout>;

export default Index;
