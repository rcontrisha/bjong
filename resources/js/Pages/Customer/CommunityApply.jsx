import React, { useState } from "react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router } from "@inertiajs/react";

export default function CommunityApply({ auth }) {
    const [form, setForm] = useState({ name: "", description: "" });

    const submit = (e) => {
        e.preventDefault();
        router.post(route("customer.communities.apply"), form);
    };

    return (
        <SidebarLayout auth={auth}>
            <h1 className="text-xl font-bold mb-4">Apply Komunitas Baru</h1>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Nama Komunitas</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="w-full p-2 rounded bg-[#2E2E2E] text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Deskripsi</label>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full p-2 rounded bg-[#2E2E2E] text-white"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 p-2 rounded-lg font-semibold"
                >
                    Submit
                </button>
            </form>
        </SidebarLayout>
    );
}
