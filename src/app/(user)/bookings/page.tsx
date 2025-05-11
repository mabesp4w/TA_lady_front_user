/** @format */

// src/app/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/stores/bookingStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import moment from "moment";

export default function BookingsPage() {
  const router = useRouter();
  const {
    roomBookings,
    facilityBookings,
    fetchRoomBookings,
    fetchFacilityBookings,
  } = useBookingStore();
  const { checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState("rooms");

  useEffect(() => {
    const init = async () => {
      const isLoggedIn = await checkAuth();

      if (!isLoggedIn) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/login");
        return;
      }

      fetchRoomBookings();
      fetchFacilityBookings();
    };

    init();
  }, [checkAuth, fetchRoomBookings, fetchFacilityBookings, router]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "dikonfirmasi":
        return "bg-blue-100 text-blue-800";
      case "check_in":
      case "digunakan":
        return "bg-green-100 text-green-800";
      case "check_out":
      case "selesai":
        return "bg-gray-100 text-gray-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "belum_dibayar":
        return "bg-red-100 text-red-800";
      case "dibayar":
        return "bg-green-100 text-green-800";
      case "dikembalikan":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pesanan Saya</h1>

      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "rooms"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("rooms")}
        >
          Kamar
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "facilities"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("facilities")}
        >
          Fasilitas
        </button>
      </div>

      {activeTab === "rooms" ? (
        <div className="space-y-4">
          {roomBookings.length > 0 ? (
            roomBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {booking.room?.roomType?.nm_jenis_kamar}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Kamar {booking.room?.no_kamar}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
                      booking.status || "menunggu"
                    )}`}
                  >
                    {booking.status === "menunggu" && "Menunggu Konfirmasi"}
                    {booking.status === "dikonfirmasi" && "Dikonfirmasi"}
                    {booking.status === "check_in" && "Check In"}
                    {booking.status === "check_out" && "Check Out"}
                    {booking.status === "dibatalkan" && "Dibatalkan"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm">
                      Check-in:{" "}
                      {moment(booking.tanggal_check_in).format("DD MMM YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm">
                      Check-out:{" "}
                      {moment(booking.tanggal_check_out).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">Total:</span>
                    <span className="font-bold text-primary ml-2">
                      Rp{booking.total_harga.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusClass(
                      booking.status_pembayaran || "belum_dibayar"
                    )}`}
                  >
                    {booking.status_pembayaran === "belum_dibayar" &&
                      "Belum Dibayar"}
                    {booking.status_pembayaran === "dibayar" && "Sudah Dibayar"}
                    {booking.status_pembayaran === "dikembalikan" &&
                      "Dikembalikan"}
                  </span>
                </div>

                <div className="mt-4">
                  <button
                    className="w-full py-2 text-sm text-primary flex items-center justify-center border border-primary rounded-lg"
                    onClick={() => router.push(`/bookings/rooms/${booking.id}`)}
                  >
                    Lihat Detail <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Anda belum memiliki pesanan kamar.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                onClick={() => router.push("/rooms")}
              >
                Pesan Kamar Sekarang
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {facilityBookings.length > 0 ? (
            facilityBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {booking.facility?.nm_fasilitas}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.jumlah_orang} Orang
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
                      booking.status || "menunggu"
                    )}`}
                  >
                    {booking.status === "menunggu" && "Menunggu Konfirmasi"}
                    {booking.status === "dikonfirmasi" && "Dikonfirmasi"}
                    {booking.status === "digunakan" && "Digunakan"}
                    {booking.status === "selesai" && "Selesai"}
                    {booking.status === "dibatalkan" && "Dibatalkan"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm">
                      Tanggal:{" "}
                      {moment(booking.tanggal_pemesanan).format("DD MMM YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm">
                      Waktu: {booking.waktu_mulai} - {booking.waktu_selesai}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">Total:</span>
                    <span className="font-bold text-primary ml-2">
                      Rp{booking.total_harga.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusClass(
                      booking.status_pembayaran || "belum_dibayar"
                    )}`}
                  >
                    {booking.status_pembayaran === "belum_dibayar" &&
                      "Belum Dibayar"}
                    {booking.status_pembayaran === "dibayar" && "Sudah Dibayar"}
                    {booking.status_pembayaran === "dikembalikan" &&
                      "Dikembalikan"}
                  </span>
                </div>

                <div className="mt-4">
                  <button
                    className="w-full py-2 text-sm text-primary flex items-center justify-center border border-primary rounded-lg"
                    onClick={() =>
                      router.push(`/bookings/facilities/${booking.id}`)
                    }
                  >
                    Lihat Detail <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Anda belum memiliki pesanan fasilitas.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                onClick={() => router.push("/facilities")}
              >
                Pesan Fasilitas Sekarang
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
