import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import PosLayout from "@/Layouts/PosLayout";

export default function Dashboard({ auth, categories, menus, shift }) {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cash, setCash] = useState("");
  const { props } = usePage();
  const flash = props.flash || {};

  const filteredMenus = menus.filter((menu) => {
    const matchCategory =
      selectedCategory === "all" || menu.category === selectedCategory;
    const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Tambahin function logout
    const handleLogout = () => {
        router.post(route("pos.logout"), {}, {
            onSuccess: () => {
            // Optional: bisa redirect ke login page
            router.visit(route("pos.login"));
            },
        });
    };

  // === CART LOGIC ===
  const addToCart = (item, variant = null) => {
    const idWithVariant = variant ? `${item.id}-${variant}` : item.id;
    const exists = cart.find((c) => c.id === idWithVariant);

    if (exists) {
      setCart(
        cart.map((c) =>
          c.id === idWithVariant ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, id: idWithVariant, variant, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((c) => c.id !== id));
  const updateQty = (id, newQty) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(newQty, 1) } : item
        )
        .filter((item) => item.qty > 0)
    );

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = cash ? parseInt(cash) - total : 0;
  const quickNominals = [10000, 20000, 50000, 100000];

  const handlePayment = () => {
    router.post(
        route("pos.transaction.store"),
        { cart, total, cash },
        {
        onSuccess: () => {
            setCash("");
            setCart([]);
            alert("Transaksi berhasil!");
        },
        }
    );
  };

  // === SIDEBAR (keranjang + pembayaran) ===
  const RightSidebar = (
  <>
    {/* Bagian Keranjang */}
    <div className="flex-1 overflow-y-auto p-6">
      <h3 className="text-lg font-bold mb-4">Keranjang</h3>
      {cart.length > 0 ? (
        <ul className="space-y-2">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                {item.variant && (
                  <p className="text-xs text-gray-400">
                    Varian: {item.variant}
                  </p>
                )}
                <p className="text-sm text-gray-300">
                  Rp {item.price.toLocaleString()} x {item.qty}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                >
                  –
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                >
                  +
                </button>
                <p className="font-bold w-24 text-right">
                  Rp {(item.price * item.qty).toLocaleString()}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Keranjang kosong</p>
      )}
    </div>

    {/* Bagian Pembayaran - Fixed di bawah */}
    <div className="border-t border-gray-700 p-6 bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-xl font-bold text-yellow-400">
          Rp {total.toLocaleString()}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Uang Tunai</label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
            placeholder="Masukkan jumlah uang"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickNominals.map((nominal) => (
              <button
                key={nominal}
                type="button"
                onClick={() => setCash(nominal)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
              >
                Rp {nominal.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span>Kembalian:</span>
          <span className="font-bold text-green-400">
            Rp {change > 0 ? change.toLocaleString() : 0}
          </span>
        </div>
      </div>

      <button
        disabled={cart.length === 0 || parseInt(cash) < total}
        onClick={handlePayment}
        className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all ${
          cart.length === 0 || parseInt(cash) < total
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
        }`}
      >
        Selesaikan Transaksi
      </button>
    </div>
  </>
);

  return (
    <PosLayout auth={auth} rightSidebar={RightSidebar}>
      {/* Alert Section */}
      {flash.success && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-lg shadow">
          {flash.success}
        </div>
      )}
      {flash.error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-lg shadow">
          {flash.error}
        </div>
      )}

      {/* Info Shift */}
      <div className="mb-4 flex justify-between items-center bg-gray-800 p-3 rounded-lg">
        <p className="text-sm text-gray-300">
            Shift Aktif: <span className="font-bold text-yellow-400">{shift?.shift_name}</span>
        </p>
        <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold"
        >
            Logout Shift
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Filter Kategori */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 flex-nowrap w-max">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-700 text-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                selectedCategory === cat.name
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Menu */}
      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(110px,1fr))]">
        {filteredMenus.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              item.variants && item.variants.length > 0
                ? (setSelectedItem(item), setShowModal(true))
                : addToCart(item)
            }
            className="w-[110px] h-[110px] p-2 bg-gray-800 rounded-lg flex flex-col cursor-pointer hover:scale-105 hover:bg-gray-700 transition-all"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-16 object-cover rounded-md mb-1"
            />
            <h3 className="font-bold text-xs truncate">{item.name}</h3>
            <p className="text-gray-300 text-xs">{item.price}</p>
          </div>
        ))}
      </div>

      {/* Modal Pilih Varian */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-96 shadow-xl border border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-yellow-400">
              Pilih Varian - {selectedItem.name}
            </h2>
            <div className="space-y-3">
              {selectedItem.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    addToCart(selectedItem, variant.name);
                    setShowModal(false);
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 flex justify-between items-center transition-all"
                >
                  <span>{variant.name}</span>
                  <span className="font-semibold">
                    Rp {variant.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </PosLayout>
  );
}
