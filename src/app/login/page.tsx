/** @format */

// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const success = await login(data.email, data.password);

      if (success) {
        toast.success("Login berhasil");
        router.push("/");
      } else {
        toast.error("Email atau password salah");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Masuk</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } pl-10`}
                placeholder="Masukkan email Anda"
                {...register("email")}
              />
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } pl-10`}
                placeholder="Masukkan password Anda"
                {...register("password")}
              />
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg bg-primary text-white font-medium ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary-dark"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Memproses...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
