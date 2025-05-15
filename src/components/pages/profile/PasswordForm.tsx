/** @format */
// src/components/pages/profile/PasswordForm.tsx
import { useForm } from "react-hook-form";
import { UpdatePasswordData } from "@/types/user";
import Button from "@/components/ui/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const passwordSchema = yup.object({
  current_password: yup
    .string()
    .required("Password saat ini wajib diisi")
    .min(6, "Password saat ini minimal 6 karakter"),
  password: yup
    .string()
    .required("Password baru wajib diisi")
    .min(8, "Password baru minimal 8 karakter")
    .matches(/[A-Z]/, "Password harus memiliki setidaknya 1 huruf besar")
    .matches(/[a-z]/, "Password harus memiliki setidaknya 1 huruf kecil")
    .matches(/[0-9]/, "Password harus memiliki setidaknya 1 angka"),
  password_confirmation: yup
    .string()
    .required("Konfirmasi password wajib diisi")
    .oneOf([yup.ref("password")], "Password konfirmasi tidak cocok"),
});

interface PasswordFormProps {
  onSubmit: (data: UpdatePasswordData) => Promise<void>;
  isLoading: boolean;
}

const PasswordForm = ({ onSubmit, isLoading }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordData>({
    resolver: yupResolver(passwordSchema),
  });

  const processSubmit = async (data: UpdatePasswordData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="current_password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password Saat Ini
          </label>
          <input
            type="password"
            id="current_password"
            {...register("current_password")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.current_password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.current_password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password Baru
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Konfirmasi Password Baru
          </label>
          <input
            type="password"
            id="password_confirmation"
            {...register("password_confirmation")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Ubah Password
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
          <p className="font-semibold mb-2">Tips password yang kuat:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gunakan minimal 8 karakter</li>
            <li>Kombinasikan huruf besar, huruf kecil, dan angka</li>
            <li>Tambahkan karakter khusus (!@#$%^&*)</li>
            <li>Hindari informasi pribadi seperti tanggal lahir</li>
            <li>Gunakan password yang berbeda untuk setiap akun</li>
          </ul>
        </div>
      </div>
    </form>
  );
};

export default PasswordForm;
