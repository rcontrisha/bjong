import React from "react";
import PosLayout from "@/Layouts/PosLayout";
import { router } from "@inertiajs/react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function Reporting({
  shift,
  total_orders,
  total_amount,
  avg_per_order,
  total_items_sold,
  items_sold,
  category_sales,
  payment_summary,
  points_collected,
  redemptions_approved,
  orders
}) {
  const handleCloseShift = () => {
    if (confirm("Tutup shift ini? Semua order baru akan dikunci.")) {
      router.post(route("pos.reporting-shift.close"));
    }
  };

  // Mapping orders per hour
  const ordersPerHour = {};
  orders.forEach(o => {
    const hour = o.created_at.slice(0, 2); // ambil jam "HH"
    ordersPerHour[hour] = (ordersPerHour[hour] || 0) + 1;
  });
  const chartOrders = Object.keys(ordersPerHour).sort().map(h => ({
    hour: `${h}:00`,
    orders: ordersPerHour[h],
  }));

  const COLORS = ["#34D399", "#FBBF24", "#60A5FA", "#F87171", "#A78BFA", "#F472B6"];

  return (
    <PosLayout>
        {/* Header: Shift Aktif + Tutup Shift */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shift Aktif: {shift.shift_name}</h1>
            <button
            onClick={handleCloseShift}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
            Tutup Shift
            </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
            { title: "Total Orders", value: total_orders },
            { title: "Total Omzet", value: `Rp ${total_amount.toLocaleString()}` },
            { title: "Avg per Order", value: `Rp ${avg_per_order.toLocaleString()}` },
            { title: "Total Items Sold", value: total_items_sold },
            ].map((card, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow text-center">
                <h2 className="font-semibold mb-2">{card.title}</h2>
                <p className="text-xl">{card.value}</p>
            </div>
            ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Orders per Hour */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4 text-center">Order per Jam</h2>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartOrders}>
                <XAxis dataKey="hour" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#FBBF24" />
                </BarChart>
            </ResponsiveContainer>
            </div>

            {/* Payment Summary Pie */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4 text-center">Payment Summary</h2>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                <Pie
                    data={payment_summary}
                    dataKey="total"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                >
                    {payment_summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Top Items Table */}
            <div className="bg-gray-800 p-3 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2 text-center">Top 5 Item Terlaris</h2>
            <div className="overflow-auto">
                <table className="table-auto w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-600">
                    <th className="px-2 py-1">Nama Item</th>
                    <th className="px-2 py-1">Qty Terjual</th>
                    </tr>
                </thead>
                <tbody>
                    {(items_sold || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-700">
                        <td className="px-2 py-1">{item.name}</td>
                        <td className="px-2 py-1">{item.total_qty}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Category Sales Table */}
            <div className="bg-gray-800 p-3 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2 text-center">Sales per Kategori</h2>
            <div className="overflow-auto">
                <table className="table-auto w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-600">
                    <th className="px-2 py-1">Kategori</th>
                    <th className="px-2 py-1">Qty Terjual</th>
                    <th className="px-2 py-1">Omzet</th>
                    </tr>
                </thead>
                <tbody>
                    {(category_sales || []).map((cat, idx) => (
                    <tr key={idx} className="hover:bg-gray-700">
                        <td className="px-2 py-1">{cat.name}</td>
                        <td className="px-2 py-1">{cat.total_qty}</td>
                        <td className="px-2 py-1">Rp {cat.total_amount.toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </PosLayout>
  );
}
