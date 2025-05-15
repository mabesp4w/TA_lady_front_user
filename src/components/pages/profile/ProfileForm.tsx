/** @format */
// src/components/pages/profile/ProfileForm.tsx
import { useForm } from "react-hook-form";
import { UpdateProfileData } from "@/types/user";
import Button from "@/components/ui/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const profileSchema = yup.object({
  name: yup
    .string()
    .required("Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter"),
  email: yup
    .string()
    .required("Email wajib diisi")
    .email("Format email tidak valid"),
  nm_pelanggan: yup
    .string()
    .required("Nama pelanggan wajib diisi")
    .min(3, "Nama pelanggan minimal 3 karakter"),
  no_hp: yup
    .string()
    .required("Nomor HP wajib diisi")
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .matches(/^[0-9]+$/, "Nomor HP hanya boleh berisi angka"),
  alamat: yup
    .string()
    .required("Alamat wajib diisi")
    .min(10, "Alamat minimal 10 karakter"),
});

interface ProfileFormProps {
  initialData: UpdateProfileData;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  isLoading: boolean;
}

const ProfileForm = ({
  initialData,
  onSubmit,
  isLoading,
}: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    resolver: yupResolver(profileSchema),
    defaultValues: initialData,
  });

  const processSubmit = async (data: UpdateProfileData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Akun
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="nm_pelanggan"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Pelanggan
          </label>
          <input
            type="text"
            id="nm_pelanggan"
            {...register("nm_pelanggan")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nm_pelanggan && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nm_pelanggan.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="no_hp"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nomor HP
          </label>
          <input
            type="text"
            id="no_hp"
            {...register("no_hp")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.no_hp && (
            <p className="mt-1 text-sm text-red-600">{errors.no_hp.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="alamat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alamat
          </label>
          <textarea
            id="alamat"
            {...register("alamat")}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.alamat && (
            <p className="mt-1 text-sm text-red-600">{errors.alamat.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
