import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import PosLayout from "@/Layouts/PosLayout";
import { Monitor, Users, X, RefreshCcw } from "lucide-react";

export default function Tables({ auth, tables, flash }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [toast, setToast] = useState(null);

  // tampilkan flash message dari Laravel
  useEffect(() => {
    if (flash) {
      setToast(flash);
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const updateStatus = (id, status) => {
    router.post(route("pos.tables.updateStatus", id), { status });
  };

  return (
    <PosLayout auth={auth}>
      <h1 className="text-2xl font-bold mb-6">Monitoring Meja</h1>

      {/* Grid meja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTable(table)}
            className={`p-4 rounded-xl shadow-lg border transition hover:scale-[1.02] w-full text-left ${
              table.status === "occupied"
                ? "bg-red-600 border-red-700"
                : "bg-green-600 border-green-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">{table.label}</span>
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              <span className="text-sm">
                {table.status === "occupied" ? "Terisi" : "Kosong"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal detail meja */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setSelectedTable(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-2">
              Detail Meja {selectedTable.label}
            </h2>
            <p className="text-gray-400 mb-2">Area: {selectedTable.area}</p>
            <p className="mb-4">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  selectedTable.status === "occupied"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {selectedTable.status}
              </span>
            </p>

            {/* Order list */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedTable.orders.length > 0 ? (
                selectedTable.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                  >
                    <p className="font-semibold mb-2">
                      Order #{order.id} - Rp {order.total_amount}
                    </p>
                    <ul className="text-sm list-disc pl-4">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} x {item.qty}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Belum ada order aktif.</p>
              )}
            </div>

            {/* Action button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => updateStatus(selectedTable.id, "active")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <RefreshCcw className="w-4 h-4" /> Tandai Aktif
              </button>
              <button
                onClick={() => updateStatus(selectedTable.id, "inactive")}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                <RefreshCcw className="w-4 h-4" /> Tandai Kosong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notif */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </PosLayout>
  );
}
