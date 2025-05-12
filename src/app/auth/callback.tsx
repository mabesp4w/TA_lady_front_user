/** @format */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface MeResponse {
  status: boolean;
  user: User;
  profile: any;
}

export default function AuthCallback() {
  const [message, setMessage] = useState<string>("Memproses autentikasi...");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Di App Router, gunakan useSearchParams untuk mendapatkan query parameters
    const token = searchParams.get("token");

    if (token) {
      // Simpan token
      localStorage.setItem("auth_token", token);

      // Dapatkan data user
      fetchUserData(token);
    } else {
      // Jika tidak ada token di URL
      setMessage("Token tidak ditemukan di URL. Silakan coba login kembali.");
    }
  }, [searchParams]);

  const fetchUserData = async (token: string) => {
    try {
      // Set header Authorization
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Get user data
      const response = await axios.get<MeResponse>(`${BASE_URL}/api/me`);

      if (response.data.status) {
        // Simpan data user
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect ke dashboard
        router.push("/dashboard");
      } else {
        setMessage("Gagal mendapatkan data user");
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
