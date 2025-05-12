/** @format */
// src/components/rooms/RoomsList.tsx
import RoomCard from "./RoomCard";
import EmptyState from "@/components/ui/EmptyState";
import { KamarType } from "@/types";
import { Search } from "lucide-react";

interface RoomsListProps {
  rooms: KamarType[];
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
