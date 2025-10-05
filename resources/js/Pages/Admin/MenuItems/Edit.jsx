import React, { useState } from "react";
import { router, Link, usePage, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { UploadCloud, Trash2 } from "lucide-react";

export default function Edit() {
    const { menuItem, categories } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        name: menuItem.name || "",
        description: menuItem.description || "",
        category_id: menuItem.category_id || "",
        base_price: menuItem.base_price || "",
        has_variants: menuItem.has_variants || false,
        variants: menuItem.variant_prices || [],
        image: null,
    });

    const [preview, setPreview] = useState(menuItem.image_url);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("admin.menu-items.update", menuItem.id), data, {
            forceFormData: true,
        });
    };

    const addVariant = () => {
        setData("variants", [...data.variants, { variant_combination: "", price: "" }]);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...data.variants];
        newVariants[index][field] = value;
        setData("variants", newVariants);
    };

    const removeVariant = (index) => {
        const newVariants = [...data.variants];
        newVariants.splice(index, 1);
        setData("variants", newVariants);
    };

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Produk & Menu", href: route("admin.menu-items.index") },
                    { label: `Edit: ${menuItem.name}` },
                ]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Detail Produk & Menu</h1>
                <Link
                    href={route("admin.menu-items.index")}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    Kembali
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Kolom Kiri */}
                    <div className="space-y-6 px-5">
                        <div>
                            <label className="block font-medium mb-1">
                                Foto Produk
                            </label>
                            <div className="border border-gray-300 rounded-xl bg-gray-50 p-4">
                                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <UploadCloud className="mx-auto w-12 h-12" />
                                            <p>Unggah Foto</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Nama Produk
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Kategori Produk
                            </label>
                            <select
                                className="w-full border rounded-lg p-2"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Deskripsi Produk
                            </label>
                            <textarea
                                rows="4"
                                className="w-full border rounded-lg p-2"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-6 px-5">
                        <label className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                checked={data.has_variants}
                                onChange={(e) =>
                                    setData("has_variants", e.target.checked)
                                }
                            />
                            Punya Varian Produk?
                        </label>

                        {data.has_variants ? (
                            <div className="space-y-3">
                                {data.variants.map((v, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-2 items-center bg-gray-50 border border-gray-200 p-3 rounded-lg"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Nama Varian"
                                            className="border p-2 rounded-lg flex-1 text-sm"
                                            value={v.variant_combination}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    i,
                                                    "variant_combination",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="number"
                                            placeholder="Harga"
                                            className="border p-2 rounded-lg w-32 text-sm"
                                            value={v.price}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    i,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(i)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="text-sm text-blue-600 font-semibold mt-2"
                                >
                                    + Tambah Opsi
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="block font-medium mb-1">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    placeholder="Harga"
                                    className="border w-full p-2 rounded-lg"
                                    value={data.base_price}
                                    onChange={(e) =>
                                        setData("base_price", e.target.value)
                                    }
                                />
                                {errors.base_price && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.base_price}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Update
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
