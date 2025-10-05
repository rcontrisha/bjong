import React from "react";
import { Link, usePage } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function Riwayat() {
    const { props } = usePage();
    const { orders, auth } = props;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(price)
            .replace("Rp", "Rp ");
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (order) => {
        if (order.payment_status === "settlement" || order.status === "paid") {
            return { text: "PAID", color: "bg-green-600 text-white" };
        } else if (order.payment_status === "pending" || order.status === "pending") {
            return { text: "PENDING", color: "bg-yellow-500 text-black" };
        } else if (order.payment_status === "expire" || order.status === "failed") {
            return { text: "FAILED", color: "bg-red-600 text-white" };
        } else if (order.payment_status === "cancel" || order.status === "cancelled") {
            return { text: "CANCELLED", color: "bg-gray-600 text-white" };
        } else {
            return { text: "UNKNOWN", color: "bg-gray-500 text-white" };
        }
    };

    return (
        <SidebarLayout auth={auth}>
            <div className="text-white">
                <h2 className="text-2xl font-bold mb-6">📜 Riwayat Pemesanan</h2>

                {orders.length === 0 ? (
                    <div className="bg-[#1e1e1e] rounded-xl p-6 text-center">
                        <p className="text-gray-400 mb-4">
                            Belum ada riwayat pemesanan.
                        </p>
                        <Link
                            href="/customer"
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        >
                            Lihat Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const badge = getStatusBadge(order);
                            return (
                                <Link
                                    key={order.id}
                                    href={route("customer.orders.show", order.id)}
                                    className="relative block bg-[#1e1e1e] rounded-xl p-4 shadow-sm hover:bg-gray-800"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-white">Order #{order.id}</p>
                                            <p className="text-gray-400 text-sm">
                                                {formatDateTime(order.created_at)}
                                            </p>
                                        </div>

                                        {/* Badge di pojok kanan atas */}
                                        <div
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                                        >
                                            {badge.text}
                                        </div>
                                    </div>

                                    {/* Harga di bawah badge */}
                                    <div className="text-right mt-2">
                                        <p className="text-red-500 font-bold">
                                            {formatPrice(order.total_amount)}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
