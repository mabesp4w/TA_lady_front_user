/** @format */
// src/components/facilities/FacilityCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Check, AlertCircle } from "lucide-react";
import { FasilitasType } from "@/types";
import Badge from "@/components/ui/Badge";
import showRupiah from "@/services/rupiah";
import { BASE_URL } from "@/services/baseURL";

interface FacilityCardProps {
  facility: FasilitasType;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const mainImage =
    facility.gambar_fasilitas?.find((img) => img.gambar_utama) ||
    facility.gambar_fasilitas?.[0];

  return (
    <Link
      href={`/facilities/${facility.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
    >
      <div className="relative h-48">
        {mainImage ? (
          <Image
            src={`${BASE_URL}/${mainImage.jalur_gambar}`}
            alt={facility.nm_fasilitas}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        {!facility.tersedia && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="red">Tidak Tersedia</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold">{facility.nm_fasilitas}</h2>
          <span className="text-primary font-bold text-lg">
            {showRupiah(facility.harga)}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-2" />
            <span>
              {facility.jam_buka} - {facility.jam_tutup}
            </span>
          </div>

          {facility.kapasitas && (
            <div className="flex items-center text-gray-600 text-sm">
              <Users size={16} className="mr-2" />
              <span>Kapasitas: {facility.kapasitas} Orang</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          {facility.tersedia ? (
            <Badge variant="green">
              <Check size={16} className="mr-1" />
              Tersedia
            </Badge>
          ) : (
            <Badge variant="red">
              <AlertCircle size={16} className="mr-1" />
              Tidak Tersedia
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
