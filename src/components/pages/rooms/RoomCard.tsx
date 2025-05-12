/** @format */
// src/components/rooms/RoomCard.tsx
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { KamarType } from "@/types";
import { BASE_URL } from "@/services/baseURL";
import showRupiah from "@/services/rupiah";

interface RoomCardProps {
  room: KamarType;
}

export default function RoomCard({ room }: RoomCardProps) {
  const getMainImage = () => {
    if (!room.gambar_kamar || room.gambar_kamar.length === 0) return null;
    return (
      room.gambar_kamar.find((img) => img.gambar_utama) || room.gambar_kamar[0]
    );
  };

  const mainImage = getMainImage();

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
    >
      <div className="relative h-48">
        {mainImage ? (
          <Image
            src={`${BASE_URL}/${mainImage.jalur_gambar}`}
            alt={room.no_kamar}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        {!room.tersedia && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="red">Tidak Tersedia</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">
              {room.jenis_kamar?.nm_jenis_kamar}
            </h2>
            <p className="text-gray-600">
              Kamar {room.no_kamar} - {room.lantai}
            </p>
          </div>
          <span className="text-primary font-bold text-lg">
            {showRupiah(room.jenis_kamar?.harga_per_malam || 0)}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-500">
            Kapasitas: {room.jenis_kamar?.kapasitas} Orang
          </p>
          {room.catatan && (
            <p className="text-sm text-gray-500 mt-1">{room.catatan}</p>
          )}
        </div>

        <div className="mt-4">
          {room.tersedia ? (
            <Badge variant="green">Tersedia</Badge>
          ) : (
            <Badge variant="red">Tidak Tersedia</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
