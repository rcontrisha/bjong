import React from "react";
import { router } from "@inertiajs/react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Dashboard({
    auth_admin, stats, salesData, ordersByCategory, recentOrders, periode,
}) {
    const COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B"];

    const handlePeriodeChange = (e) => {
        const value = e.target.value;
        router.visit(route("admin.dashboard"), {
            method: "get",
            data: { periode: value },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="mt-3 md:mt-0">
                    <select
                        value={periode || "bulan_ini"}
                        onChange={handlePeriodeChange}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-red-200"
                    >
                        <option value="bulan_ini">Bulan ini</option>
                        <option value="bulan_lalu">Bulan lalu</option>
                        <option value="tahun_ini">Tahun ini</option>
                    </select>
                </div>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Total Penjualan</h3>
                    <p className="text-xl font-bold mt-1">
                        Rp {stats.total_sales.toLocaleString("id-ID")}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Jumlah Pesanan</h3>
                    <p className="text-xl font-bold mt-1">{stats.orders_count}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Produk Terjual</h3>
                    <p className="text-xl font-bold mt-1">{stats.products_count}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Rasio Transaksi</h3>
                    <p className="text-sm font-semibold mt-1">{stats.transaction_ratio}</p>
                </div>
            </div>

            {/* Grafik Tren & Menu Terlaris */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="font-semibold mb-4">Tren Penjualan</h2>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#EF4444" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="font-semibold mb-4">Menu Terlaris</h2>
                    <div className="flex items-center justify-center h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ordersByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                >
                                    {ordersByCategory.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pesanan Terbaru */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-4">Pesanan Terbaru</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left w-10">No.</th>
                                <th className="p-3 text-left">Nama Pelanggan</th>
                                <th className="p-3 text-left">Nomor Meja</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={order.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{index + 1}.</td>
                                    <td className="p-3">{order.customer}</td>
                                    <td className="p-3">{order.table_number}</td>
                                    <td className="p-3">
                                        Rp {order.total.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-3">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => (
    <AdminLayout auth_admin={page.props.auth_admin}>{page}</AdminLayout>
);
