import React, { useState } from "react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { Link, router } from "@inertiajs/react";
import { Calendar, User, Users, Award, X } from "lucide-react";

export default function MyCommunities({ auth, communities }) {
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [referralCode, setReferralCode] = useState("");

    const handleJoin = (e) => {
        e.preventDefault();
        router.post(route("customer.communities.join"), { referral_code: referralCode }, {
            onSuccess: () => {
                alert("✅ Permintaan gabung komunitas berhasil dikirim!");
                setShowJoinModal(false);
                setReferralCode("");
            },
            onError: (errors) => {
                alert("❌ Gagal mengirim permintaan.");
                console.error(errors);
            }
        });
    };

    return (
        <SidebarLayout auth={auth}>
            {/* Judul + Button Gabung */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <h1 className="text-2xl font-bold truncate min-w-0">My Communities</h1>
                <button
                    onClick={() => setShowJoinModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold flex items-center gap-2 flex-shrink-0"
                >
                    <Users className="w-5 h-5" />
                    <span>Gabung</span>
                </button>
            </div>

            {communities.length === 0 ? (
                <p className="text-gray-400 italic">Belum join komunitas.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((c) => (
                        <Link
                            key={c.id}
                            href={route("customer.communities.show", c.id)}
                            className="relative bg-[#2E2E2E] p-5 rounded-xl shadow hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-white font-bold text-xl mb-1">{c.name}</h2>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${
                                        c.status === "inactive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                                    }`}
                                >
                                    {c.status}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 bg-gray-700 rounded-xl p-3 flex flex-col items-center justify-center">
                                    <div className="flex items-center gap-1 mb-2 text-gray-300">
                                        <User className="w-5 h-5" />
                                        <span className="text-sm font-medium">Members</span>
                                    </div>
                                    <span className="text-white font-extrabold text-2xl">{c.members_count}</span>
                                </div>

                                <div className="flex-1 bg-red-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center justify-center border border-red-500 shadow-md">
                                    <div className="flex items-center gap-1 mb-2 text-red-300">
                                        <Award className="w-5 h-5" />
                                        <span className="text-sm font-medium">Points</span>
                                    </div>
                                    <span className="text-red-400 font-extrabold text-2xl">{c.points}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Tombol Ajukan Komunitas Baru */}
            <div className="mt-8">
                <Link
                    href={route("customer.communities.apply")}
                    className="block text-center bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-semibold transition-colors duration-200"
                >
                    Ajukan Komunitas Baru
                </Link>
            </div>

            {/* Modal Join Community */}
            {showJoinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-[#1e1e1e] p-6 rounded-xl w-96 relative">
                        <button
                            onClick={() => setShowJoinModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-white">Gabung Komunitas</h2>
                        <form onSubmit={handleJoin} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Referral Code"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                className="p-2 rounded-lg bg-[#2e2e2e] text-white border border-gray-600 focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg font-semibold"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
