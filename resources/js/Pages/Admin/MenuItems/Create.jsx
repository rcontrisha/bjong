import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

function Create({ auth, categories }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        category_id: "",
        base_price: "",
        has_variants: false,
        variants: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("admin.menu-items.store"), form);
    };

    const addVariant = () => {
        setForm({
            ...form,
            variants: [...form.variants, { name: "", price: "" }],
        });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Menu & Produk", href: route("admin.menu-items.index") },
                    { label: "Tambah Menu" },
                ]}
            />

            <h1 className="text-2xl font-bold">Tambah Menu</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Nama"
                    className="border w-full p-2 rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <textarea
                    placeholder="Deskripsi"
                    className="border w-full p-2 rounded"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <select
                    className="border w-full p-2 rounded"
                    value={form.category_id}
                    onChange={(e) =>
                        setForm({ ...form, category_id: e.target.value })
                    }
                >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Harga"
                    className="border w-full p-2 rounded"
                    value={form.base_price}
                    onChange={(e) =>
                        setForm({ ...form, base_price: e.target.value })
                    }
                    disabled={form.has_variants}
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.has_variants}
                        onChange={(e) =>
                            setForm({ ...form, has_variants: e.target.checked })
                        }
                    />
                    Punya Varian Harga?
                </label>

                {form.has_variants && (
                    <div className="space-y-2">
                        {form.variants.map((v, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nama Varian"
                                    className="border p-2 rounded flex-1"
                                    value={v.name}
                                    onChange={(e) => {
                                        const newVariants = [...form.variants];
                                        newVariants[i].name = e.target.value;
                                        setForm({ ...form, variants: newVariants });
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Harga"
                                    className="border p-2 rounded w-32"
                                    value={v.price}
                                    onChange={(e) => {
                                        const newVariants = [...form.variants];
                                        newVariants[i].price = e.target.value;
                                        setForm({ ...form, variants: newVariants });
                                    }}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addVariant}
                            className="text-blue-600"
                        >
                            + Tambah Varian
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Simpan
                </button>
            </form>
        </div>
    );
}

Create.layout = (page) => <AdminLayout auth={page.props.auth}>{page}</AdminLayout>;

export default Create;
