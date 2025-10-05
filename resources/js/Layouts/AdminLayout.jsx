import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    LayoutDashboard,
    FileText,
    Utensils,
    Users,
    UserCog,
    QrCode,
} from "lucide-react";

export default function AdminLayout({ auth_admin = {}, children }) {
    const [isOpen, setIsOpen] = useState(false);

    // Ambil user dari guard admin, bukan dari default auth
    const user = auth_admin.user || null;

    const navLinkClass = (routeName) =>
        `flex items-center gap-2 p-2 rounded-lg transition ${
            route().current(routeName)
                ? "bg-gray-800 text-red-400 font-semibold"
                : "hover:bg-gray-800"
        }`;

    return (
        <div className="h-screen flex bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50 md:translate-x-0 md:static flex flex-col`}
            >
                <div className="p-6 flex-1 flex flex-col overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <h2 className="text-xl font-bold text-red-500">Admin</h2>
                    </div>

                    {/* Info Admin */}
                    {user && (
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                {user.profile_picture ? (
                                    <img
                                        src={`/storage/${user.profile_picture}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg font-bold">
                                        {user.name[0]}
                                    </span>
                                )}
                            </div>
                            <p className="font-semibold mt-2">{user.name}</p>
                            <p className="text-sm text-gray-400">
                                {user.role || "Administrator"}
                            </p>
                        </div>
                    )}

                    {/* Navigasi */}
                    <nav className="space-y-2 flex-1">
                        <Link
                            href={route("admin.dashboard")}
                            className={navLinkClass("admin.dashboard")}
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link
                            href={route("admin.menu-items.index")}
                            className={navLinkClass("admin.menu-items.*")}
                            onClick={() => setIsOpen(false)}
                        >
                            <Utensils size={18} />
                            Produk & Menu
                        </Link>
                        <Link
                            href={route("admin.communities.index")}
                            className={navLinkClass("admin.communities.index")}
                            onClick={() => setIsOpen(false)}
                        >
                            <Users size={18} />
                            Membership
                        </Link>
                        <Link
                            href={route("admin.shift-accounts.index")}
                            className={navLinkClass("admin.shift-accounts.index")}
                            onClick={() => setIsOpen(false)}
                        >
                            <UserCog size={18} />
                            Manage Akun Shift
                        </Link>
                        <Link
                            href={route("admin.tables.index")}
                            className={navLinkClass("admin.tables.index")}
                            onClick={() => setIsOpen(false)}
                        >
                            <QrCode size={18} />
                            Manage QR Code
                        </Link>
                    </nav>
                </div>

                {/* Logout */}
                <div className="p-6 border-t border-gray-700">
                    {user && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                router.post(route("admin.logout"));
                            }}
                            className="w-full bg-red-500 hover:bg-red-600 p-2 rounded-lg font-semibold text-center"
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Topbar */}
                <div className="bg-gray-800 text-white flex items-center justify-end px-6 h-14 shadow">
                    {user && (
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                {user.profile_picture ? (
                                    <img
                                        src={`/storage/${user.profile_picture}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold">
                                        {user.name[0]}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm">
                                <p className="font-medium leading-tight">
                                    {user.name}
                                </p>
                                <p className="text-gray-300 text-xs leading-tight">
                                    {user.role || "Administrator"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Page Content (scrollable) */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
