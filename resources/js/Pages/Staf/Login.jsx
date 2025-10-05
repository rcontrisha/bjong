import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function PosLogin() {
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("pos.login.submit"));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-[480px] bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          POS Login
        </h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-600">Username</label>
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData("username", e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {processing ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
