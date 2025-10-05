import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import axios from "axios";

export default function Cart() {
    const { props } = usePage();
    const { cartItems, total, auth, estimatedPoints } = props;

    // State buat Guest user
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [loading, setLoading] = useState(false); // tambahan loading state

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(price)
            .replace("Rp", "Rp ");
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        router.put(route("customer.cart.update", itemId), { quantity: newQuantity });
    };

    const removeItem = (itemId) => {
        router.delete(route("customer.cart.destroy", itemId));
    };

    const clearCart = () => {
        if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
            router.delete(route("customer.cart.clear"));
        }
    };

    const handleCheckout = async () => {
        // Validasi guest input
        if (!auth.user) {
            if (!guestName.trim() || !guestPhone.trim()) {
                alert("Nama dan nomor telepon wajib diisi!");
                return;
            }
        }

        const communityId = auth.user?.community_id ?? null;
        console.log("🧩 Auth user community_id:", auth.user?.community_id);

        setLoading(true);

        try {
            console.log("🔥 Mulai checkout, guest data:", { guestName, guestPhone, guestEmail });

            const res = await axios.post(route("customer.cart.checkout"), {
                name: guestName,
                phone: guestPhone,
                email: guestEmail,
                community_id: communityId
            });

            console.log("✅ Response backend:", res.data);

            const { token, order_id } = res.data; // ambil order_id dari response backend

            if (token) {
                console.log("💳 Snap token diterima:", token);
                window.snap.pay(token, {
                    onSuccess: (result) => {
                        console.log("🎉 Pembayaran sukses callback result:", result);
                        console.log("📦 Menggunakan order_id dari backend:", order_id);

                        alert("Pembayaran sukses!");
                        router.visit(route("customer.orders.summary", order_id));

                        // Reset guest form
                        setGuestName("");
                        setGuestPhone("");
                        setGuestEmail("");
                    },
                    onPending: (result) => {
                        console.log("⏳ Pembayaran pending callback result:", result);
                        alert("Menunggu pembayaran!");
                    },
                    onError: (result) => {
                        console.error("❌ Pembayaran gagal callback result:", result);
                        alert("Pembayaran gagal!");
                    },
                    onClose: () => {
                        console.warn("✋ Popup Snap ditutup sebelum selesai pembayaran");
                        alert("Anda menutup popup tanpa menyelesaikan pembayaran");
                    },
                });
            } else {
                console.warn("⚠️ Token Snap kosong, tidak bisa melanjutkan pembayaran");
            }
        } catch (err) {
            console.error("🚨 Gagal request token:", err);
            alert("Gagal memulai pembayaran");
        } finally {
            console.log("🛑 Checkout process selesai, loading false");
            setLoading(false);
        }
    };

    return (
        <SidebarLayout auth={auth}>
            <div className="text-white">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Link
                        href="/customer"
                        className="text-red-500 hover:text-red-400 text-sm"
                    >
                        &larr; Kembali ke Dashboard
                    </Link>
                </div>

                <h2 className="text-2xl font-bold mb-6">🛒 Keranjang Belanja</h2>

                {cartItems.length === 0 ? (
                    <div className="bg-[#1e1e1e] rounded-xl p-6 text-center">
                        <p className="text-gray-400 mb-4">
                            Keranjang belanja Anda kosong
                        </p>
                        <Link
                            href="/customer"
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        >
                            Lihat Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items */}
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#1e1e1e] rounded-xl p-4 flex items-center shadow-sm"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg mr-4"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">
                                        {item.name}
                                    </h3>
                                    {item.variant_combination && (
                                        <p className="text-gray-400 text-sm">
                                            Varian: {item.variant_combination}
                                        </p>
                                    )}
                                    <p className="text-red-500 font-semibold">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity - 1)
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-full flex items-center justify-center"
                                    >
                                        -
                                    </button>

                                    <span className="mx-2">{item.quantity}</span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity + 1)
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-full flex items-center justify-center"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="ml-4 text-red-500 hover:text-red-400 text-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Form Data Guest */}
                        {!auth.user && (
                            <div className="bg-[#1e1e1e] rounded-xl p-5 space-y-3">
                                <h3 className="text-lg font-semibold mb-3">
                                    Data Pemesan
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    className="w-full p-2 border border-gray-600 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Nomor Telepon"
                                    className="w-full p-2 border border-gray-600 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email (opsional)"
                                    className="w-full p-2 border border-gray-600 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Total and Actions */}
                        <div className="bg-[#1e1e1e] rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-xl font-bold text-red-500">
                                    {formatPrice(total)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold">Estimasi Poin:</span>
                                <span className="text-xl font-bold text-yellow-400">
                                    {estimatedPoints} pts
                                </span>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={clearCart}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg"
                                    disabled={loading}
                                >
                                    Kosongkan Keranjang
                                </button>

                                <button
                                    onClick={handleCheckout}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow-md"
                                    disabled={loading}
                                >
                                    {loading ? "Memproses..." : "Checkout"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
