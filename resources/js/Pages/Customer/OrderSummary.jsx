import React from "react";
import { Link, usePage } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function OrderSummary() {
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

    return (
        <SidebarLayout auth={auth}>
            <div className="text-white max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-6">🧾 Struk Pesanan #{order.id}</h2>

                {/* Info Pemesan */}
                <div className="bg-[#1e1e1e] rounded-xl p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Info Pemesan</h3>
                    <p><span className="font-semibold">Nama: </span>{order.user ? order.user.name : order.guest_name}</p>
                    <p><span className="font-semibold">Email: </span>{order.user ? order.user.email : order.guest_email || "-"}</p>
                    <p><span className="font-semibold">Telepon: </span>{order.user ? order.user.phone : order.guest_phone || "-"}</p>
                    <p><span className="font-semibold">Tanggal: </span>{formatDateTime(order.created_at)}</p>
                    <p><span className="font-semibold">Metode Pembayaran: </span>{order.payment_method || "-"}</p>
                    <p>
                        <span className="font-semibold">Status Pembayaran: </span>
                        <span className={`px-2 py-1 rounded-lg ${order.payment_status === "settlement" ? "bg-green-600" : "bg-yellow-600"}`}>
                            {order.payment_status.toUpperCase()}
                        </span>
                    </p>
                </div>

                {/* Items */}
                <div className="bg-[#1e1e1e] rounded-xl p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Rincian Pesanan</h3>
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between mb-2 border-b border-gray-700 pb-2">
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                {item.variant_combination && <p className="text-gray-400 text-sm">Varian: {item.variant_combination}</p>}
                                <p className="text-gray-400 text-sm">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                            </div>
                            <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                        </div>
                    ))}

                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-700">
                        <span className="font-semibold text-lg">Total:</span>
                        <span className="font-bold text-red-500 text-lg">{formatPrice(order.total_amount)}</span>
                    </div>
                </div>

                {/* Kembali ke Dashboard */}
                <div className="text-center">
                    <Link href="/customer" className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </SidebarLayout>
    );
}
