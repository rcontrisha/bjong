import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function Profile({ auth, user }) {
  const [preview, setPreview] = useState(
	user.profile_picture ? `/storage/${user.profile_picture}` : null
  );

  const [data, setData] = useState({
	name: user.name || "",
	email: user.email || "",
	phone: user.phone || "",
	profile_picture: undefined,
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleProfileUpdate = (e) => {
	e.preventDefault();
	setProcessing(true);
	setErrors({});

	const formData = new FormData();
	formData.append("name", data.name);
	formData.append("email", data.email);
	if (data.profile_picture) formData.append("profile_picture", data.profile_picture);
	formData.append("_method", "PUT");

	router.post(route("customer.profile.update"), formData, {
		forceFormData: true,
		preserveScroll: true,
		onSuccess: () => {
		// update preview sementara pakai file baru (jika ada)
		if (data.profile_picture) {
			setPreview(URL.createObjectURL(data.profile_picture));
		} else if (auth.user.profile_picture) {
			setPreview(`/storage/${auth.user.profile_picture}`);
		}

		setData({ ...data, profile_picture: undefined });

		// reload auth.user supaya sidebar langsung update
		router.reload({ only: ["auth.user", "flash"] });
		setProcessing(false);
		},
		onError: (err) => {
		setErrors(err);
		setProcessing(false);
		},
	});
	};

  const handleDeleteAccount = () => {
	if (confirm("Apakah kamu yakin ingin menghapus akun?")) {
	  router.delete(route("customer.profile.destroy"));
	}
  };

  return (
	<SidebarLayout auth={auth}>
	  <Head title="Profile" />
	  <div className="max-w-2xl mx-auto space-y-8">
		<h1 className="text-2xl font-bold text-white">👤 Profile</h1>

		<form onSubmit={handleProfileUpdate} className="bg-[#2E2E2E] p-6 rounded-xl space-y-4">
		  <h2 className="text-xl font-semibold text-white">Informasi Akun</h2>

		  {/* Foto Profil */}
		  <div className="flex flex-col items-center mb-4 relative">
			<div
			  className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-2 text-gray-400 cursor-pointer relative overflow-hidden"
			  onClick={() => document.getElementById("profileInput").click()}
			>
			  {preview ? (
				<img
				  src={preview}
				  alt="Preview"
				  className="w-full h-full object-cover rounded-full"
				/>
			  ) : (
				<span>Foto</span>
			  )}

			  {data.profile_picture && (
				<button
				  type="button"
				  onClick={(e) => {
					e.stopPropagation();
					setData({ ...data, profile_picture: undefined });
					setPreview(user.profile_picture ? `/storage/${user.profile_picture}` : null);
				  }}
				  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-opacity-70"
				>
				  ×
				</button>
			  )}
			</div>

			<input
			  type="file"
			  id="profileInput"
			  accept="image/*"
			  onChange={(e) => {
				if (e.target.files && e.target.files[0]) {
				  setData({ ...data, profile_picture: e.target.files[0] });
				  setPreview(URL.createObjectURL(e.target.files[0]));
				}
			  }}
			  className="hidden"
			/>
			{errors.profile_picture && (
			  <p className="text-red-500 text-sm mt-1">{errors.profile_picture}</p>
			)}
		  </div>

		  {/* Nama */}
		  <div>
			<label className="block text-gray-300 mb-1">Nama</label>
			<input
			  type="text"
			  value={data.name}
			  onChange={(e) => setData({ ...data, name: e.target.value })}
			  className="w-full p-2 rounded bg-[#1E1E1E] border border-gray-600 focus:border-red-500 focus:ring-red-500"
			/>
			{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
		  </div>

		  {/* Email */}
		  <div>
			<label className="block text-gray-300 mb-1">Email</label>
			<input
			  type="email"
			  value={data.email}
			  onChange={(e) => setData({ ...data, email: e.target.value })}
			  className="w-full p-2 rounded bg-[#1E1E1E] border border-gray-600 focus:border-red-500 focus:ring-red-500"
			/>
			{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
		  </div>

		  {/* Nomor Telepon */}
		  <div>
			<label className="block text-gray-300 mb-1">Nomor Telepon</label>
			<input
			  type="text"
			  value={data.phone}
			  disabled
			  className="w-full p-2 rounded bg-[#1E1E1E] border border-gray-600 cursor-not-allowed text-gray-400"
			/>
		  </div>

		  <button
			type="submit"
			disabled={processing}
			className="w-full py-2 px-4 bg-[#D94135] rounded-lg font-bold hover:bg-red-700"
		  >
			Simpan Perubahan
		  </button>
		</form>

		{/* Hapus Akun */}
		<div className="bg-[#2E2E2E] p-6 rounded-xl space-y-2">
		  <h2 className="text-xl font-semibold text-white">Hapus Akun</h2>
		  <p className="text-gray-400 text-sm">
			Menghapus akun akan menghapus semua data. Tindakan ini tidak bisa
			dibatalkan.
		  </p>
		  <button
			onClick={handleDeleteAccount}
			className="w-full py-2 px-4 bg-red-600 rounded-lg font-bold hover:bg-red-700"
		  >
			Hapus Akun
		  </button>
		</div>
	  </div>
	</SidebarLayout>
  );
}
