/** @format */

// src/app/rooms/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useRoomStore } from "@/stores/roomStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import {
  Calendar,
  Users,
  Check,
  AlertCircle,
  MapPin,
  Navigation,
} from "lucide-react";
import moment from "moment";
import ResortMap from "@/components/maps/ResortMap";
import Link from "next/link";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { selectedRoom, getRoom } = useRoomStore();
  const { createRoomBooking } = useBookingStore();
  const { user, checkAuth } = useAuthStore();

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRoom(roomId);
    checkAuth();
  }, [roomId, getRoom, checkAuth]);

  useEffect(() => {
    if (checkInDate && checkOutDate && selectedRoom?.roomType) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days > 0) {
        setTotalPrice(days * selectedRoom.roomType.harga_per_malam);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, selectedRoom]);

  if (!selectedRoom) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleBookNow = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Silakan pilih tanggal check-in dan check-out");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("Tanggal tidak valid");
      return;
    }

    const booking = {
      kamar_id: selectedRoom.id,
      tanggal_check_in: checkInDate,
      tanggal_check_out: checkOutDate,
      total_harga: totalPrice,
    };

    setIsLoading(true);

    try {
      const success = await createRoomBooking(booking);

      if (success) {
        toast.success("Pemesanan berhasil dibuat");
        router.push("/bookings");
      } else {
        toast.error("Gagal membuat pemesanan");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Terjadi kesalahan saat membuat pemesanan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Room Images */}
      <div className="relative rounded-lg overflow-hidden">
        <div className="relative h-64">
          {selectedRoom.images && selectedRoom.images.length > 0 ? (
            <Image
              src={selectedRoom.images[currentImageIndex].jalur_gambar}
              alt={selectedRoom.no_kamar}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {selectedRoom.images && selectedRoom.images.length > 1 && (
          <div className="flex justify-center mt-2 space-x-2 py-2">
            {selectedRoom.images.map((image, idx) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full ${
                  idx === currentImageIndex ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">
          {selectedRoom.roomType?.nm_jenis_kamar}
        </h1>
        <p className="text-gray-600">
          Kamar {selectedRoom.no_kamar} - {selectedRoom.lantai}
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <Users className="text-gray-500 mr-2" size={20} />
            <span>Kapasitas: {selectedRoom.roomType?.kapasitas} Orang</span>
          </div>

          <div className="py-2 border-t border-b border-gray-100">
            <p className="text-gray-700">
              {selectedRoom.roomType?.deskripsi || "Tidak ada deskripsi"}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-primary font-bold text-2xl">
              Rp{selectedRoom.roomType?.harga_per_malam.toLocaleString("id-ID")}
              <span className="text-sm text-gray-500 font-normal">/malam</span>
            </div>

            <div>
              {selectedRoom.tersedia ? (
                <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Check size={16} className="mr-1" />
                  Tersedia
                </span>
              ) : (
                <span className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  Tidak Tersedia
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedRoom.tersedia && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Pesan Kamar</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Tanggal Check-in
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  min={moment().format("YYYY-MM-DD")}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
                <Calendar
                  className="absolute right-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Tanggal Check-out
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  min={
                    checkInDate || moment().add(1, "days").format("YYYY-MM-DD")
                  }
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
                <Calendar
                  className="absolute right-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Harga per malam</span>
                  <span>
                    Rp
                    {selectedRoom.roomType?.harga_per_malam.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Jumlah malam</span>
                  <span>
                    {Math.ceil(
                      (new Date(checkOutDate).getTime() -
                        new Date(checkInDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>
            )}

            <button
              className={`w-full py-3 px-4 rounded-lg bg-primary text-white font-medium ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary-dark"
              }`}
              onClick={handleBookNow}
              disabled={
                isLoading || !checkInDate || !checkOutDate || totalPrice <= 0
              }
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Memproses...
                </span>
              ) : (
                "Pesan Sekarang"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Location Map Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Lokasi Resort</h2>

        <ResortMap height="200px" />

        <div className="mt-4">
          <div className="flex items-center">
            <MapPin size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">
              Jl. Holtekamp, Distrik Muara Tami, Kota Jayapura, Papua
            </span>
          </div>

          <Link
            href="/location"
            className="flex items-center justify-center mt-4 py-2 text-primary border border-primary rounded-lg"
          >
            <Navigation size={18} className="mr-2" />
            Lihat Petunjuk Arah
          </Link>
        </div>
      </div>
    </div>
  );
}
