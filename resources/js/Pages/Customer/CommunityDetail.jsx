import React from "react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { User, Award, TrendingUp, Phone, Clock } from "lucide-react";

export default function CommunityDetail({ auth, community }) {
    if (!community) {
        return (
            <SidebarLayout auth={auth}>
                <p className="text-gray-400">Data komunitas tidak tersedia.</p>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout auth={auth}>
            <h1 className="text-2xl font-bold mb-6">Detail Komunitas</h1>

            {/* Main Info Card */}
            <div className="relative bg-gray-700 p-6 rounded-xl mb-6">
                <h2 className="text-white font-bold text-2xl mb-3">{community.name}</h2>

                {/* Badge Status */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {community.status && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            {community.status}
                        </span>
                    )}
                    {community.approval_status && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            {community.approval_status}
                        </span>
                    )}
                </div>

                {/* Total Points */}
                <div className="border-t border-gray-500 pt-4 relative">
                    <div className="flex items-center gap-2 mb-1 text-green-400 text-sm">
                        <Award className="w-4 h-4" />
                        <span>TOTAL POINTS</span>
                    </div>
                    <div className="text-white font-extrabold text-3xl mb-2">{community.points}</div>
                    <div className="flex items-center text-green-300 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Active Community</span>
                    </div>
                    <Award className="absolute right-3 top-3 w-16 h-16 text-green-500 opacity-20" />
                </div>
            </div>

            {/* Members & Contact Person Cards */}
            <div className="flex flex-wrap gap-4 mb-6">
                {/* Members */}
                <div className="flex-1 min-w-[45%] bg-gray-700 p-4 rounded-xl flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-300 font-medium">Members</span>
                    </div>
                    <hr className="border-gray-500 mb-3" />

                    {/* Content */}
                    <div className="flex flex-col flex-1 justify-center items-center">
                        <span className="text-white font-extrabold text-3xl">
                            {community.members_count ?? 0}
                        </span>
                        <span className="text-gray-400 text-xs mt-1">Total anggota</span>
                    </div>
                </div>

                {/* Contact Person */}
                <div className="flex-1 min-w-[45%] bg-gray-700 p-4 rounded-xl flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-300 font-medium">Kontak</span>
                    </div>
                    <hr className="border-gray-500 mb-3" />

                    {/* Content */}
                    <div className="flex flex-col gap-2 flex-1 justify-center">
                        <p className="text-gray-400 text-xs">Nama</p>
                        <p className="text-white font-bold">{community.contact_name ?? "-"}</p>
                        <p className="text-gray-400 text-xs">No. Telepon</p>
                        <p className="text-white">{community.contact_phone ?? "-"}</p>
                    </div>
                </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-gray-700 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-300 font-medium">Timeline</span>
                </div>
                <hr className="border-gray-500" />
                <p className="text-gray-400 text-sm mt-2">Riwayat aktivitas akan muncul di sini.</p>
            </div>
        </SidebarLayout>
    );
}
