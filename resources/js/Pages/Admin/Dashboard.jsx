import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import AdminLayout from "@/Layouts/AdminLayout";

function Dashboard({ auth_admin, stats, salesData, ordersByCategory, recentOrders }) {
    const COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B"];

    return (
        <div className="space-y-6">
            {/* Topbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <select className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200">
                    <option>Bulan ini</option>
                    <option>Bulan lalu</option>
                    <option>Tahun ini</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm text-gray-500">Total Penjualan</h2>
                    <p className="text-xl font-bold">
                        Rp {stats.total_sales?.toLocaleString("id-ID")}
                    </p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm text-gray-500">Pesanan</h2>
                    <p className="text-xl font-bold">{stats.orders_count}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm text-gray-500">Produk</h2>
                    <p className="text-xl font-bold">{stats.products_count}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm text-gray-500">Customer</h2>
                    <p className="text-xl font-bold">{stats.customers_count}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="font-semibold mb-4">Penjualan per Hari</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={salesData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="font-semibold mb-4">Pesanan per Kategori</h2>
                    <ResponsiveContainer width="100%" height={250}>
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

            {/* Recent Orders */}
            <div className="bg-white shadow rounded-xl p-4">
                <h2 className="font-semibold mb-4">Pesanan Terbaru</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-2">#</th>
                                <th className="p-2">Customer</th>
                                <th className="p-2">Total</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{order.id}</td>
                                    <td className="p-2">{order.customer}</td>
                                    <td className="p-2">
                                        Rp {order.total.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${
                                                order.status === "Selesai"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.status === "Proses"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// 🔹 Pakai AdminLayout otomatis & kasih prop auth_admin
Dashboard.layout = (page) => (
    <AdminLayout auth_admin={page.props.auth_admin}>{page}</AdminLayout>
);

export default Dashboard;
