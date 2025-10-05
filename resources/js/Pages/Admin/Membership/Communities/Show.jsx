import React, { useState } from "react";
import { usePage, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Show() {
    const { community, auth_admin } = usePage().props;

    // Form untuk tambah transaksi poin
    const { data, setData, post, processing, reset, errors } = useForm({
        points: "",
        description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.communities.transactions.store", community.id), {
            onSuccess: () => reset(),
        });
    };

    // Form pengajuan pencairan
    const redemptionForm = useForm({
        points_used: "",
        amount_received: "",
    });

    const handleRedeem = (e) => {
        e.preventDefault();
        redemptionForm.post(
            route("admin.communities.redemptions.store", community.id),
            {
                onSuccess: () => redemptionForm.reset(),
            }
        );
    };

    return (
        <AdminLayout auth_admin={auth_admin}>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Membership", href: "#" },
                    { label: "Komunitas", href: route("admin.communities.index") },
                    { label: community.name },
                ]}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">
                    Detail Komunitas: {community.name}
                </h1>
                <Link
                    href={route("admin.communities.edit", community.id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Edit
                </Link>
            </div>

            {/* Info */}
            <div className="bg-white shadow rounded-lg p-6 space-y-4 mb-8">
                <p>
                    <strong>Penanggungjawab:</strong> {community.contact_name}
                </p>
                <p>
                    <strong>Telepon:</strong> {community.contact_phone}
                </p>
                <p>
                    <strong>Status:</strong>{" "}
                    {community.status === "active" ? "Aktif" : "Nonaktif"}
                </p>
                <p>
                    <strong>Total Poin:</strong> {community.points}
                </p>
            </div>

            {/* Anggota */}
            <div className="mb-10">
                <h2 className="text-lg font-bold mb-2">Anggota</h2>
                <div className="bg-white shadow rounded-lg p-4">
                    {community.members.length > 0 ? (
                        <ul className="space-y-2">
                            {community.members.map((m) => (
                                <li
                                    key={m.id}
                                    className="flex justify-between border-b py-2"
                                >
                                    <span>{m.user?.name}</span>
                                    <span className="text-sm text-gray-500">
                                        {m.role || "-"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">
                            Belum ada anggota ditambahkan
                        </p>
                    )}
                </div>
            </div>

            {/* Transaksi Poin */}
            <div className="mb-10">
                <h2 className="text-lg font-bold mb-4">Transaksi Poin</h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow rounded-lg p-4 space-y-3 mb-6"
                >
                    <div>
                        <label className="block text-sm font-medium">
                            Jumlah Poin
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded p-2"
                            value={data.points}
                            onChange={(e) =>
                                setData("points", e.target.value)
                            }
                        />
                        {errors.points && (
                            <p className="text-red-500 text-sm">
                                {errors.points}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Keterangan
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        + Tambah Transaksi
                    </button>
                </form>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Tanggal</th>
                                <th className="px-4 py-2">Poin</th>
                                <th className="px-4 py-2">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {community.transactions.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(
                                            t.created_at
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">{t.points}</td>
                                    <td className="px-4 py-2">
                                        {t.description}
                                    </td>
                                </tr>
                            ))}
                            {community.transactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center text-gray-500 py-4"
                                    >
                                        Belum ada transaksi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pencairan */}
            <div>
                <h2 className="text-lg font-bold mb-4">Pencairan Poin</h2>
                <form
                    onSubmit={handleRedeem}
                    className="bg-white shadow rounded-lg p-4 space-y-3 mb-6"
                >
                    <div>
                        <label className="block text-sm font-medium">
                            Poin Digunakan
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded p-2"
                            value={redemptionForm.data.points_used}
                            onChange={(e) =>
                                redemptionForm.setData(
                                    "points_used",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Nilai Rupiah
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded p-2"
                            value={redemptionForm.data.amount_received}
                            onChange={(e) =>
                                redemptionForm.setData(
                                    "amount_received",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={redemptionForm.processing}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Ajukan Pencairan
                    </button>
                </form>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Tanggal</th>
                                <th className="px-4 py-2">Poin</th>
                                <th className="px-4 py-2">Nilai Rupiah</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {community.redemptions.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(
                                            r.created_at
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.points_used}
                                    </td>
                                    <td className="px-4 py-2">
                                        Rp {r.amount_received}
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.status}
                                    </td>
                                </tr>
                            ))}
                            {community.redemptions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center text-gray-500 py-4"
                                    >
                                        Belum ada pengajuan pencairan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
