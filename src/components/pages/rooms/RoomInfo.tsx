/** @format */
// src/components/rooms/RoomInfo.tsx
import { Users, Check, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface RoomInfoProps {
  room: {
    no_kamar: string;
    lantai: string;
    tersedia: boolean;
    jenis_kamar?: {
      nm_jenis_kamar: string;
      kapasitas: number;
      harga_per_malam: number;
      deskripsi?: string;
    };
  };
}

export default function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold">{room.jenis_kamar?.nm_jenis_kamar}</h1>
      <p className="text-gray-600">
        Kamar {room.no_kamar} - {room.lantai}
      </p>

      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <Users className="text-gray-500 mr-2" size={20} />
          <span>Kapasitas: {room.jenis_kamar?.kapasitas} Orang</span>
        </div>

        <div className="py-2 border-t border-b border-gray-100">
          <p className="text-gray-700">
            {room.jenis_kamar?.deskripsi || "Tidak ada deskripsi"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-primary font-bold text-2xl">
            Rp
            {room.jenis_kamar?.harga_per_malam.toLocaleString("id-ID")}
            <span className="text-sm text-gray-500 font-normal">/malam</span>
          </div>

          <div>
            {room.tersedia ? (
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
      </div>
    </div>
  );
}
