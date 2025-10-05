import React, { useState, useRef, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function OtpLogin() {
  const [step, setStep] = useState(1);
  const [nomor, setNomor] = useState("");
  const otpLength = 6;
  const inputRefs = useRef([]);
  const [counter, setCounter] = useState(0); // countdown detik

  // useForm data
  const { data, setData, post, processing, errors, reset } = useForm({
    nomor: "",
    otp: "",
  });

  useEffect(() => {
    console.log("DEBUG - Initial token dari URL:", data.token);
  }, []);

  // Verifikasi OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    console.log("DEBUG - Data sebelum verify:", data); // 🔍 cek apakah token ikut
    post(route("customer.otp.verify"), {
      preserveState: true,
      onSuccess: () => {
        console.log("DEBUG - Verify sukses, redirect jalan dari backend");
      },
      onError: (errors) => {
        console.log("DEBUG - Verify gagal:", errors);
      },
    });
  };

  // Start countdown 30 detik
  const startCountdown = () => {
    setCounter(60);
  };

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  // Kirim OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    post(route("customer.otp.send"), {
      onSuccess: () => {
        setStep(2);
        setNomor(data.nomor);
        reset("otp");
        startCountdown(); // mulai countdown
      },
    });
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (counter > 0) return;
    post(route("customer.otp.send"), {
      onSuccess: () => {
        reset("otp");
        startCountdown();
      },
    });
  };

  // Update OTP digit
  const handleOtpChange = (value, index) => {
    let otp = data.otp.split("");
    otp[index] = value.slice(-1);
    setData("otp", otp.join(""));
    if (value && index < otpLength - 1) inputRefs.current[index + 1].focus();
  };

  // Backspace auto focus prev
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !data.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <Head title="Login dengan OTP" />

      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-full m-10 bg-[#2E2E2E] rounded-xl shadow-lg p-6 text-white">
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h1 className="text-xl font-bold text-center mb-6">
                📱 Login dengan OTP
              </h1>
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Nomor Telepon<span className="text-red-600">*</span>{" "}
                </label>
                <input
                  type="text"
                  name="nomor"
                  value={data.nomor}
                  onChange={(e) => setData("nomor", e.target.value)}
                  className="mt-1 block w-full rounded-lg bg-black text-white border border-gray-600 focus:border-red-500 focus:ring-red-500 sm:text-sm p-2"
                  placeholder="08xxxxxxxxxx"
                />
                {errors.nomor && (
                  <p className="mt-1 text-sm text-red-500">{errors.nomor}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full py-2 px-4 bg-[#D94135] text-white font-bold rounded-lg hover:bg-red-700"
              >
                {processing ? "Mengirim..." : "Kirim OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">🔐 Verifikasi OTP</h1>
                <p className="text-sm text-gray-400">
                  Kode OTP dikirim ke{" "}
                  <span className="font-semibold text-white">{nomor}</span>
                </p>
              </div>

              {/* OTP Boxes */}
              <div className="flex justify-center space-x-3">
                {Array.from({ length: otpLength }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={data.otp[index] || ""}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-xl font-bold text-white bg-[#2E2E2E] border-b-4 border-gray-600 focus:border-[#D94135] focus:outline-none rounded-md"
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-sm text-red-500 text-center">{errors.otp}</p>
              )}

              {/* CTA */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 px-4 bg-[#D94135] text-white font-bold rounded-xl hover:bg-red-700 shadow-md"
                >
                  {processing ? "Memverifikasi..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 px-4 bg-[#4D4D4D] text-white rounded-xl"
                >
                  Ubah Nomor
                </button>
              </div>

              {/* Resend with countdown */}
              <p className="text-center text-sm text-gray-400">
                Tidak menerima kode?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={counter > 0 || processing}
                  className={`font-semibold ${
                    counter > 0
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-[#D94135] hover:underline"
                  }`}
                >
                  Kirim Ulang {counter > 0 && `(${counter}s)`}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
