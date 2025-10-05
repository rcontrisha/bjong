import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function RiwayatDetail() {
    const { props } = usePage();
    const { order, auth } = props;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price).replace("Rp", "Rp ");
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

    const handleRepeatOrder = () => {
        router.post(route("customer.orders.repeat", order.id), {}, {
            onSuccess: () => {
                const toast = document.createElement("div");
                toast.innerText = "✅ Order berhasil ditambahkan ke cart!";
                toast.className = "fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg";
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
                setTimeout(() => router.visit(route("customer.cart.index")), 500);
            },
            onError: (errors) => {
                alert("❌ Gagal repeat order.");
                console.error(errors);
            }
        });
    };

    // Tentukan warna & teks badge
    const getBadge = (order) => {
        if (order.status === "paid" || order.payment_status === "settlement") {
            return { color: "bg-green-600", text: "PAID" };
        }
        if (order.status === "failed" || order.payment_status === "expire") {
            return { color: "bg-red-600", text: "FAILED" };
        }
        if (order.status === "cancelled" || order.payment_status === "cancel") {
            return { color: "bg-gray-600", text: "CANCELLED" };
        }
        return { color: "bg-yellow-600", text: "PENDING" };
    };

    const badge = getBadge(order);

    return (
        <SidebarLayout auth={auth}>
            <div className="text-white">
                <div className="mb-4">
                    <Link
                        href={route("customer.orders.history")}
                        className="text-red-500 hover:text-red-400 text-sm"
                    >
                        &larr; Kembali ke Riwayat Pemesanan
                    </Link>
                </div>

                <div className="relative mb-6 bg-[#1e1e1e] rounded-xl p-5">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold">📄 Detail Order #{order.id}</h2>
                        <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                        >
                            {badge.text}
                        </div>
                    </div>
                </div>

                {/* Info Pemesan */}
                <div className="bg-[#1e1e1e] rounded-xl p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Info Pemesan</h3>
                    <p><span className="font-semibold">Nama: </span>{order.user ? order.user.name : order.guest_name}</p>
                    <p><span className="font-semibold">Email: </span>{order.user ? order.user.email : order.guest_email || "-"}</p>
                    <p><span className="font-semibold">Telepon: </span>{order.user ? order.user.phone : order.guest_phone || "-"}</p>
                    <p><span className="font-semibold">Tanggal: </span>{formatDateTime(order.created_at)}</p>
                    <p><span className="font-semibold">Metode Pembayaran: </span>{order.payment_method || "-"}</p>
                </div>

                {/* Items */}
                <div className="bg-[#1e1e1e] rounded-xl p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Rincian Pesanan</h3>
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between mb-2 border-b border-gray-700 pb-2">
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                {item.variant_combination && (
                                    <p className="text-gray-400 text-sm">
                                        Varian: {item.variant_combination}
                                    </p>
                                )}
                                <p className="text-gray-400 text-sm">
                                    Qty: {item.quantity} x {formatPrice(item.price)}
                                </p>
                            </div>
                            <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                        </div>
                    ))}
                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-700">
                        <span className="font-semibold text-lg">Total:</span>
                        <span className="font-bold text-red-500 text-lg">{formatPrice(order.total_amount)}</span>
                    </div>
                </div>

                {/* Repeat Order Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleRepeatOrder}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        🔁 Repeat Order
                    </button>
                </div>
            </div>
        </SidebarLayout>
    );
}
