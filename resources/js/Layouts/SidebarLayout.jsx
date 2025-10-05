import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Menu,            // hamburger
    ShoppingCart,    // keranjang
    Home,            // dashboard
    Clock,           // riwayat
    Star,            // membership
    User             // profile
} from "lucide-react";

export default function SidebarLayout({ auth, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
            {/* Header (mobile only) */}
            <header className="flex items-center justify-between bg-[#2E2E2E] text-white p-4 md:hidden">
                {/* Kiri: hamburger + logo */}
                <div className="flex items-center gap-3">
                    <button
                        className="text-white focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-end gap-2">
                        <img
                            src="/images/logo.png"
                            alt="Bjongngopi Logo"
                            className="w-7 h-7 object-contain"
                        />
                        <h1 className="text-lg font-bold">Bjongngopi</h1>
                    </div>
                </div>

                {/* Kanan: icon keranjang */}
                <Link
                    href={route("customer.cart.index")}
                    className="p-2 rounded-lg hover:bg-[#4D4D4D] transition"
                    onClick={() => setIsOpen(false)}
                >
                    <ShoppingCart className="w-6 h-6" />
                </Link>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 bg-[#2E2E2E] text-white w-64 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50 md:translate-x-0 md:static flex flex-col`}
            >
                <div className="p-6 flex-1 flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                        <img
                            src="/images/logo.png"
                            alt="Bjongngopi Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <h2 className="text-xl font-bold text-red-500">
                            Bjongngopi
                        </h2>
                    </div>

                    {/* Avatar + Info user */}
                    {auth.user && (
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                {auth.user.profile_picture ? (
                                    <img
                                        src={`/storage/${auth.user.profile_picture}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <p className="font-semibold mt-2">{auth.user.name}</p>
                            <p className="text-sm text-gray-300">{auth.user.phone}</p>
                        </div>
                    )}

                    {/* Navigasi */}
                    <nav className="space-y-3 flex-1">
                        <Link
                            href={route("customer.dashboard")}
                            className="flex items-center gap-2 hover:bg-[#4D4D4D] p-2 rounded-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            <Home className="w-5 h-5" /> Dashboard
                        </Link>

                        {auth.user && (
                            <>
                                <Link
                                    href={route("customer.orders.history")}
                                    className="flex items-center gap-2 hover:bg-[#4D4D4D] p-2 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Clock className="w-5 h-5" /> Riwayat Pesanan
                                </Link>
                                <Link
                                    href={route("customer.communities.index")}
                                    className="flex items-center gap-2 hover:bg-[#4D4D4D] p-2 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Star className="w-5 h-5" /> Membership
                                </Link>
                                <Link
                                    href={route("customer.profile.index")}
                                    className="flex items-center gap-2 hover:bg-[#4D4D4D] p-2 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="w-5 h-5" /> Profile
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Bagian paling bawah */}
                <div className="p-6 border-t border-gray-700">
                    {!auth.user && (
                        <Link
                            href={route("customer.otp.login")}
                            className="block w-full text-center bg-red-500 hover:bg-red-600 p-2 rounded-lg font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            Login / Register
                        </Link>
                    )}

                    {auth.user && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                router.post(route("logout"));
                            }}
                            className="block w-full text-center bg-red-500 hover:bg-red-600 p-2 rounded-lg font-semibold"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </aside>

            {/* Overlay (mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <main className="flex-1 p-6 md:ml-64">{children}</main>
        </div>
    );
}
