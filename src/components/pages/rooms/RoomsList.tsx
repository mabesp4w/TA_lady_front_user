/** @format */
// src/components/rooms/RoomsList.tsx
import RoomCard from "./RoomCard";
import EmptyState from "@/components/ui/EmptyState";
import { Search } from "lucide-react";

interface Room {
  id: string;
  no_kamar: string;
  lantai: string;
  tersedia: boolean;
  jenis_kamar_id: string;
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
}

interface RoomsListProps {
  rooms: Room[];
}

export default function RoomsList({ rooms }: RoomsListProps) {
  if (rooms.length === 0) {
    return (
      <EmptyState
        icon={<Search size={48} />}
        title="Tidak ada kamar yang ditemukan"
        description="Tidak ada kamar yang sesuai dengan kriteria pencarian Anda."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
