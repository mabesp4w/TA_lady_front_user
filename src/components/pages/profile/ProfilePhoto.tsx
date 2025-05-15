/** @format */
// src/components/pages/profile/ProfilePhoto.tsx
import { useState, useRef } from "react";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";
import Button from "@/components/ui/Button";
import { Upload } from "lucide-react";

interface ProfilePhotoProps {
  photoUrl?: string;
  name: string;
  onUpload: (file: File) => Promise<void>;
}

const ProfilePhoto = ({ photoUrl, name, onUpload }: ProfilePhotoProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diizinkan");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error("Error uploading photo:", error);
      // Reset preview if upload fails
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        {photoUrl || previewUrl ? (
          <Image
            src={previewUrl || `${BASE_URL}/${photoUrl}`}
            alt={name}
            width={128}
            height={128}
            className="rounded-full object-cover w-full h-full border-4 border-gray-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-gray-200">
            {getInitials(name)}
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleChooseFile}
        isLoading={isUploading}
        disabled={isUploading}
        className="text-sm flex items-center"
      >
        <Upload size={16} className="mr-1" />
        Ganti Foto Profil
      </Button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Format: JPG, PNG, GIF (maks 2MB)
      </p>
    </div>
  );
};

export default ProfilePhoto;
