import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { FileDown, Filter, X } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Transactions({ orders, filters, paymentMethods, categories, shifts, summary, charts }) {
    const { auth_admin } = usePage().props;

    const { data, setData, get, processing } = useForm({
        tanggal_awal: filters.tanggal_awal || '',
        tanggal_akhir: filters.tanggal_akhir || '',
        metode_pembayaran: filters.metode_pembayaran || '',
        kategori: filters.kategori || '',
        shift: filters.shift || '',
    });

    const [activeQuickFilter, setActiveQuickFilter] = React.useState('');

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.reports.transactions.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setData({
            tanggal_awal: '',
            tanggal_akhir: '',
            metode_pembayaran: '',
            kategori: '',
            shift: '',
        });
        router.visit(route('admin.reports.transactions.index'));
    };

    const setQuickFilter = (type) => {
        const today = new Date();
        let start, end;

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        if (type === 'today') {
            start = end = formatDate(today);
        } else if (type === 'week') {
            const startDate = new Date();
            startDate.setDate(today.getDate() - 6);
            start = formatDate(startDate);
            end = formatDate(today);
        } else if (type === 'month') {
            const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            start = formatDate(startDate);
            end = formatDate(today);
        }

        setActiveQuickFilter(type);
        setData({ ...data, tanggal_awal: start, tanggal_akhir: end });

        router.get(route('admin.reports.transactions.index'), {
            tanggal_awal: start,
            tanggal_akhir: end,
            metode_pembayaran: data.metode_pembayaran,
            kategori: data.kategori,
            shift: data.shift,
        }, { preserveState: true, preserveScroll: true });
    };

    // Tambahin di atas "return ("
    const formatLabel = (label) => {
        if (label.includes('Previous') || label === 'pagination.previous') return 'Prev';
        if (label.includes('Next') || label === 'pagination.next') return 'Next';
        // Hapus HTML entities kayak &laquo; dan &raquo;
        return label.replace(/&laquo;|&raquo;/g, '').trim();
    };
    
    return (
        <AdminLayout auth_admin={auth_admin}>
            <Head title="Laporan Transaksi" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Laporan Transaksi</h1>
                <PrimaryButton
                    onClick={() => {
                        const params = new URLSearchParams(data).toString();
                        window.location.href = route('admin.reports.transactions.export') + '?' + params;
                    }}
                >
                    <FileDown size={18} className="mr-2" />
                    Export ke Excel
                </PrimaryButton>
            </div>

            {/* ===== Filter Section ===== */}
            <h2 className="text-lg font-semibold mb-3">Filter Data</h2>
            <form onSubmit={handleFilter} className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <InputLabel value="Tanggal Awal" />
                        <input type="date" value={data.tanggal_awal}
                            onChange={(e) => setData('tanggal_awal', e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <InputLabel value="Tanggal Akhir" />
                        <input type="date" value={data.tanggal_akhir}
                            onChange={(e) => setData('tanggal_akhir', e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <InputLabel value="Metode Pembayaran" />
                        <select value={data.metode_pembayaran}
                            onChange={(e) => setData('metode_pembayaran', e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="">Semua</option>
                            {paymentMethods.map(m => (<option key={m} value={m}>{m}</option>))}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Kategori" />
                        <select value={data.kategori}
                            onChange={(e) => setData('kategori', e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="">Semua</option>
                            {categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Shift" />
                        <select value={data.shift}
                            onChange={(e) => setData('shift', e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="">Semua</option>
                            {shifts.map(s => (<option key={s.id} value={s.id}>{s.shift_name}</option>))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between items-center mt-4">
                    <div className="flex flex-wrap gap-2">
                        {['today', 'week', 'month'].map((type) => {
                            const label = type === 'today' ? 'Hari Ini' : type === 'week' ? 'Minggu Ini' : 'Bulan Ini';
                            const isActive = activeQuickFilter === type;
                            return (
                                <button key={type} type="button" onClick={() => setQuickFilter(type)}
                                    className={`px-4 py-2 text-sm rounded-md ${
                                        isActive ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                    }`}>
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="button" onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                            <X size={18} className="inline-block mr-1" /> Clear Filter
                        </button>
                        <PrimaryButton disabled={processing}>
                            <Filter size={18} className="mr-2" /> Terapkan Filter
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            {/* ===== Summary Section ===== */}
            <h2 className="text-lg font-semibold mb-3">Ringkasan Laporan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">Total Pendapatan</h3>
                    <p className="text-3xl font-bold">Rp {new Intl.NumberFormat('id-ID').format(summary.totalRevenue)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">Total Transaksi</h3>
                    <p className="text-3xl font-bold">{summary.totalTransactions}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">Rata-Rata per Transaksi</h3>
                    <p className="text-3xl font-bold">
                        Rp {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(summary.averagePerTransaction)}
                    </p>
                </div>
            </div>

            {/* ===== Transaction Table Section ===== */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Riwayat Transaksi</h2>
                <div className="flex gap-2">
                    {orders.links.map((link, index) => (
                        link.url && (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-3 py-2 text-sm border rounded-md ${
                                    link.active ? 'bg-indigo-500 text-white' : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                {formatLabel(link.label)}
                            </Link>
                        )
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">ID Transaksi</th>
                            <th className="p-4">Order ID Midtrans</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Metode Pembayaran</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.length > 0 ? orders.data.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{order.id}</td>
                                <td className="p-4">{order.midtrans_order_id || 'Cash'}</td>
                                <td className="p-4">{new Date(order.created_at).toLocaleString('id-ID')}</td>
                                <td className="p-4">{order.user?.name || 'Guest'}</td>
                                <td className="p-4">{order.payment_method}</td>
                                <td className="p-4">Rp {new Intl.NumberFormat('id-ID').format(order.total_amount)}</td>
                                <td className="p-4">
                                    {(() => {
                                        const s = order.status;
                                        const ps = order.payment_status;
                                        let label = '', color = '';
                                        if ((s === 'paid' && ps === 'settlement') || (s === 'paid' && ps === 'pending')) {
                                            label = 'Berhasil (Paid)'; color = 'bg-green-100 text-green-800';
                                        } else if (s === 'pending' || ps === 'pending') {
                                            label = 'Menunggu Pembayaran'; color = 'bg-yellow-100 text-yellow-800';
                                        } else if (s === 'failed' || ps === 'expire') {
                                            label = 'Gagal'; color = 'bg-red-100 text-red-800';
                                        } else if (s === 'cancelled' || ps === 'cancel') {
                                            label = 'Dibatalkan'; color = 'bg-gray-200 text-gray-800';
                                        } else {
                                            label = `${s} / ${ps}`; color = 'bg-slate-100 text-slate-800';
                                        }
                                        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{label}</span>;
                                    })()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">Tidak ada data transaksi.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
