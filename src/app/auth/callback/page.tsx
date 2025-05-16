/** @format */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/authStore";

export default function AuthCallback() {
  const [message, setMessage] = useState<string>("Memproses autentikasi...");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Di App Router, gunakan useSearchParams untuk mendapatkan query parameters
    const token = searchParams.get("token");

    if (token) {
      // Simpan token
      Cookies.set("token", token);

      // Dapatkan data user
      fetchUserData();
    } else {
      // Jika tidak ada token di URL
      setMessage("Token tidak ditemukan di URL. Silakan coba login kembali.");
    }
  }, [searchParams]);

  const fetchUserData = async () => {
    try {
      const cek = await checkAuth();
      if (cek) {
        setMessage("Login berhasil. Akan dialihkan ke halaman utama");
        router.push("/");
      }
    } catch (error: any) {
      setMessage(
        "Terjadi kesalahan saat verifikasi: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">Autentikasi Google</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
