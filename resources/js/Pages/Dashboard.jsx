import React from "react";
import { Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

// Komponen Kartu Menu
function MenuCard({ item }) {
    return (
        <Link
            href={`/customer/menu/${item.id}`}
            className="p-2 bg-[#2E2E2E] rounded-xl shadow hover:bg-[#4D4D4D] transition block"
        >
            <img
                src={`/storage/${item.image}`}
                alt={item.name}
                loading="lazy"
                className="w-full h-20 object-cover rounded-lg mb-1"
            />
            <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
            <p className="text-gray-400 text-xs">{item.price}</p>
        </Link>
    );
}

// Komponen Promo
function PromoCard({ promo }) {
    return (
        <div className="p-4 bg-[#2E2E2E] rounded-xl shadow-sm">
            <h4 className="font-bold text-white">{promo.title}</h4>
            <p className="text-sm text-gray-400">{promo.desc}</p>
        </div>
    );
}

export default function Dashboard({
    auth,
    categories = [],
    menus = [],
    promos = [],
    tableNumber = null,
}) {
    const [selectedCategory, setSelectedCategory] = React.useState("All");
    const [searchQuery, setSearchQuery] = React.useState("");

    // Filter menu (optimized pakai useMemo)
    const filteredMenu = React.useMemo(() => {
        return menus
            .filter(
                (item) =>
                    selectedCategory === "All" ||
                    item.category === selectedCategory
            )
            .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [menus, selectedCategory, searchQuery]);

    // Rekomendasi random (cuma di-generate sekali)
    const recommendations = React.useMemo(() => {
        return [...menus].sort(() => 0.5 - Math.random()).slice(0, 2);
    }, [menus]);

    return (
        <SidebarLayout auth={auth}>
            <div className="text-white flex flex-col min-h-screen">
                <div className="flex-1">
                    {/* Info Meja */}
                    {tableNumber && (
                        <div className="w-full flex flex-col items-center mb-6">
                            <p className="text-xs text-gray-400 mb-1">Nomor Meja</p>
                            <div className="w-full text-center px-5 py-2 bg-red-900 text-white rounded-xl shadow text-lg font-bold">
                                {tableNumber}
                            </div>
                        </div>
                    )}

                    {/* Greeting */}
                    {auth.user ? (
                        <p className="mb-4 text-gray-300">
                            Selamat datang,{" "}
                            <span className="font-semibold text-white">
                                {auth.user.phone}
                            </span>{" "}
                            🎉
                        </p>
                    ) : (
                        <p className="mb-4 text-gray-300">
                            Kamu sedang akses sebagai{" "}
                            <span className="font-semibold text-white">
                                Guest
                            </span>
                            . Bisa lihat-lihat menu tanpa login, atau klik{" "}
                            <span className="text-red-500 font-semibold">
                                Login/Register
                            </span>{" "}
                            di sidebar.
                        </p>
                    )}

                    {/* Promo Section */}
                    {promos.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">
                                🔥 Program Spesial
                            </h3>
                            <div className="space-y-3">
                                {promos.map((promo) => (
                                    <PromoCard key={promo.id} promo={promo} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">
                                🎯 Rekomendasi Buat Kamu
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {recommendations.map((item) => (
                                    <MenuCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category Section */}
                    <div className="mb-3">
                        <h3 className="text-xl font-semibold mb-3">
                            Kategori Menu
                        </h3>
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-6 py-1 rounded-full border min-w-[100px] max-w-[180px] text-center text-sm ${
                                    selectedCategory === "All"
                                        ? "bg-red-500 text-white"
                                        : "bg-[#2E2E2E] text-gray-300"
                                }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-2 py-1 rounded-full border min-w-[100px] max-w-[180px] text-center ${
                                        selectedCategory === cat.name
                                            ? "bg-red-500 text-white"
                                            : "bg-[#2E2E2E] text-gray-300"
                                    }`}
                                    style={{
                                        fontSize: `${Math.min(
                                            14,
                                            180 / cat.name.length
                                        )}px`,
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Cari menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 rounded-xl bg-[#2E2E2E] text-white placeholder-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* All Menu */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">
                            ✨ Semua Menu
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {filteredMenu.slice(0, 12).map((item) => (
                                <MenuCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-auto p-4 bg-[#1F1F1F] text-gray-400 text-center rounded-xl">
                    &copy; 2025 Bjongngopi. All rights reserved.
                </footer>
            </div>
        </SidebarLayout>
    );
}
