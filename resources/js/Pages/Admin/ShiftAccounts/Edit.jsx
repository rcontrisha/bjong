import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ shiftAccount }) {
    const { data, setData, put, processing, errors } = useForm({
        shift_name: shiftAccount.shift_name || "",
        username: shiftAccount.username || "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.shift-accounts.update", shiftAccount.id));
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit Akun Shift</h1>
                <Link
                    href={route("admin.shift-accounts.index")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                    Kembali
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow space-y-4 max-w-lg"
            >
                <div>
                    <label className="block font-semibold mb-1">Nama Shift</label>
                    <input
                        type="text"
                        value={data.shift_name}
                        onChange={(e) => setData("shift_name", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.shift_name && (
                        <p className="text-red-500 text-sm">{errors.shift_name}</p>
                    )}
                </div>

                <div>
                    <label className="block font-semibold mb-1">Username</label>
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                </div>

                <div>
                    <label className="block font-semibold mb-1">
                        Password (isi jika ingin ganti)
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    Update
                </button>
            </form>
        </AdminLayout>
    );
}
