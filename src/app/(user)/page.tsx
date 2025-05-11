/** @format */

// src/app/page.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRoomStore } from "@/stores/roomStore";
import { useFacilityStore } from "@/stores/facilityStore";
import { ChevronRight, MapPin } from "lucide-react";
import ResortMap from "@/components/maps/ResortMap";

export default function HomePage() {
  const { rooms, fetchRooms } = useRoomStore();
  const { facilities, fetchFacilities } = useFacilityStore();

  useEffect(() => {
    fetchRooms();
    fetchFacilities();
  }, [fetchRooms, fetchFacilities]);

  return (
    <div className="space-y-8 mb-16">
      {/* Hero Section */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image
          src="/images/resort-hero.jpg"
          alt="Resort Terminal 12 Holtekamp"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Resort Terminal 12 Holtekamp
          </h1>
          <p className="text-center mb-4">
            Nikmati Pengalaman Menginap Yang Tak Terlupakan
          </p>
          <Link href="/rooms" className="btn btn-primary">
            Pesan Kamar Sekarang
          </Link>
        </div>
      </div>

      {/* Feature Sections */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Kamar Tersedia</h2>
          <Link href="/rooms" className="text-primary flex items-center">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {rooms.slice(0, 4).map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.id}`}
                className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden"
              >
                {room.images && room.images.length > 0 ? (
                  <div className="relative h-32">
                    <Image
                      src={
                        room.images.find((img) => img.gambar_utama)
                          ?.jalur_gambar || room.images[0].jalur_gambar
                      }
                      alt={room.no_kamar}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold mb-1">
                    {room.roomType?.nm_jenis_kamar}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Kamar {room.no_kamar} - {room.lantai}
                  </p>
                  <p className="text-primary font-bold">
                    Rp{room.roomType?.harga_per_malam.toLocaleString("id-ID")}
                    /malam
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Fasilitas Resort</h2>
          <Link href="/facilities" className="text-primary flex items-center">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {facilities.slice(0, 4).map((facility) => (
              <Link
                key={facility.id}
                href={`/facilities/${facility.id}`}
                className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden"
              >
                {facility.images && facility.images.length > 0 ? (
                  <div className="relative h-32">
                    <Image
                      src={
                        facility.images.find((img) => img.gambar_utama)
                          ?.jalur_gambar || facility.images[0].jalur_gambar
                      }
                      alt={facility.nm_fasilitas}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold mb-1">
                    {facility.nm_fasilitas}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {facility.jam_buka} - {facility.jam_tutup}
                  </p>
                  <p className="text-primary font-bold">
                    Rp{facility.harga.toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Resort Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Tentang Resort Terminal 12 Holtekamp
        </h2>
        <p className="text-gray-700 mb-4">
          Resort Terminal 12 Holtekamp adalah tempat peristirahatan mewah yang
          terletak di lokasi strategis dengan pemandangan yang menakjubkan. Kami
          menawarkan berbagai fasilitas premium dan pelayanan terbaik untuk
          membuat liburan Anda menjadi pengalaman yang tak terlupakan.
        </p>
        <Link href="/about" className="text-primary flex items-center">
          Pelajari Lebih Lanjut <ChevronRight size={16} />
        </Link>
        <div className="mt-4 mb-4">
          <ResortMap height="150px" interactive={false} />
        </div>
        <div className="flex items-center mb-4">
          <MapPin size={18} className="text-primary mr-2" />
          <span className="text-gray-700">
            Jl. Holtekamp, Distrik Muara Tami, Kota Jayapura, Papua
          </span>
        </div>
      </section>
    </div>
  );
}
