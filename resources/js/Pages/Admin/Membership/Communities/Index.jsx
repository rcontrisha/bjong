import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Index() {
    const { communities } = usePage().props;
    const [showPendingModal, setShowPendingModal] = useState(false);

    const pendingCommunities = communities.filter(
        (c) => c.status === "inactive" && c.approval_status === "pending"
    );

    const handleApprove = (communityId) => {
        router.post(route("admin.communities.approve", communityId), {}, {
            preserveScroll: true,
            onSuccess: () => router.reload(),
        });
    };

    const handleReject = (communityId) => {
        router.post(route("admin.communities.reject", communityId), {}, {
            preserveScroll: true,
            onSuccess: () => router.reload(),
        });
    };

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: route("admin.dashboard") },
                    { label: "Membership", href: "#" },
                    { label: "Komunitas" },
                ]}
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Daftar Komunitas</h1>
                <div className="space-x-2">
                    {pendingCommunities.length > 0 && (
                        <button
                            onClick={() => setShowPendingModal(true)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Lihat Pengajuan ({pendingCommunities.length})
                        </button>
                    )}
                    <Link
                        href={route("admin.communities.create")}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        + Tambah Komunitas
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Nama</th>
                            <th className="px-4 py-2">Penanggungjawab</th>
                            <th className="px-4 py-2">Telepon</th>
                            <th className="px-4 py-2">Anggota</th>
                            <th className="px-4 py-2">Poin</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {communities.map((c) => (
                            <tr key={c.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{c.name}</td>
                                <td className="px-4 py-2">{c.contact_name}</td>
                                <td className="px-4 py-2">{c.contact_phone}</td>
                                <td className="px-4 py-2">{c.members_count}</td>
                                <td className="px-4 py-2">{c.points}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <Link
                                        href={route("admin.communities.show", c.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Detail
                                    </Link>
                                    <Link
                                        href={route("admin.communities.edit", c.id)}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {communities.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                    Belum ada komunitas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal pengajuan */}
            {showPendingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-y-auto p-6 relative">
                        <h2 className="text-lg font-bold mb-4">Pengajuan Komunitas</h2>
                        <button
                            onClick={() => setShowPendingModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>

                        {pendingCommunities.length === 0 ? (
                            <p className="text-gray-500">Tidak ada pengajuan komunitas baru.</p>
                        ) : (
                            <ul className="space-y-2">
                                {pendingCommunities.map((c) => (
                                    <li
                                        key={c.id}
                                        className="border p-2 rounded flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-semibold">{c.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {c.contact_name} ({c.contact_phone})
                                            </p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleApprove(c.id)}
                                                className="text-green-600 hover:underline text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(c.id)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
