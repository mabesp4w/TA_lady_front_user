/** @format */
// src/components/rooms/RoomCard.tsx
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";

interface RoomCardProps {
  room: {
    id: string;
    no_kamar: string;
    lantai: string;
    tersedia: boolean;
    catatan?: string;
    roomType?: {
      nm_jenis_kamar: string;
      harga_per_malam: number;
      kapasitas: number;
    };
    images?: {
      jalur_gambar: string;
      gambar_utama?: boolean;
    }[];
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  const getMainImage = () => {
    if (!room.images || room.images.length === 0) return null;
    return room.images.find((img) => img.gambar_utama) || room.images[0];
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
            src={mainImage.jalur_gambar}
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
              {room.roomType?.nm_jenis_kamar}
            </h2>
            <p className="text-gray-600">
              Kamar {room.no_kamar} - {room.lantai}
            </p>
          </div>
          <span className="text-primary font-bold text-lg">
            Rp{room.roomType?.harga_per_malam.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-500">
            Kapasitas: {room.roomType?.kapasitas} Orang
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
