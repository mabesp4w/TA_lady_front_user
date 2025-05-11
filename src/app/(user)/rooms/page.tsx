/** @format */

// src/app/rooms/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRoomStore } from "@/stores/roomStore";
import { Search, Filter } from "lucide-react";

export default function RoomsPage() {
  const { rooms, roomTypes, fetchRooms, fetchRoomTypes } = useRoomStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, [fetchRooms, fetchRoomTypes]);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.no_kamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.nm_jenis_kamar
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType = selectedType
      ? room.jenis_kamar_id === selectedType
      : true;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daftar Kamar</h1>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kamar..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-300 appearance-none pl-10"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Semua Jenis Kamar</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nm_jenis_kamar}
              </option>
            ))}
          </select>
          <Filter className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        {filteredRooms.map((room) => (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {room.images && room.images.length > 0 ? (
              <div className="relative h-48">
                <Image
                  src={
                    room.images.find((img) => img.gambar_utama)?.jalur_gambar ||
                    room.images[0].jalur_gambar
                  }
                  alt={room.no_kamar}
                  fill
                  className="object-cover"
                />
                {!room.tersedia && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Tidak Tersedia
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}

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
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Tersedia
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Tidak Tersedia
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Tidak ada kamar yang sesuai dengan kriteria pencarian.
          </p>
        </div>
      )}
    </div>
  );
}
