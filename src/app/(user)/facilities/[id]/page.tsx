/** @format */
// src/app/bookings/facilities/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/stores/bookingStore";
import { formatDate } from "@/utils/DateUtils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/animation/FadeIn";
import withAuth from "@/components/hoc/withAuth";
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import showRupiah from "@/services/rupiah";
import Image from "next/image";

function FacilityBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { getFacilityBooking, selectedFacilityBooking, isLoading } =
    useBookingStore();

  useEffect(() => {
    getFacilityBooking(bookingId);
  }, [getFacilityBooking, bookingId]);

  if (isLoading || !selectedFacilityBooking) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat detail pemesanan..." />
      </div>
    );
  }

  const booking = selectedFacilityBooking;

  const getStatusBadge = (status: string = "menunggu") => {
    switch (status) {
      case "menunggu":
        return <Badge variant="yellow">Menunggu Konfirmasi</Badge>;
      case "dikonfirmasi":
        return <Badge variant="blue">Dikonfirmasi</Badge>;
      case "digunakan":
        return <Badge variant="green">Digunakan</Badge>;
      case "selesai":
        return <Badge variant="gray">Selesai</Badge>;
      case "dibatalkan":
        return <Badge variant="red">Dibatalkan</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string = "belum_dibayar") => {
    switch (status) {
      case "belum_dibayar":
        return <Badge variant="red">Belum Dibayar</Badge>;
      case "dibayar":
        return <Badge variant="green">Sudah Dibayar</Badge>;
      case "dikembalikan":
        return <Badge variant="gray">Dikembalikan</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          className="mr-3 text-gray-600 hover:text-gray-900"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Detail Pemesanan Fasilitas</h1>
      </div>

      <FadeIn>
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                {booking.fasilitas?.nm_fasilitas}
              </h2>
              <p className="text-sm text-gray-600">
                Kode: {booking.kode_pemesanan}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-start">
              <Calendar size={18} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Tanggal Pemesanan</p>
                <p className="text-gray-600">
                  {formatDate(booking.tanggal_pemesanan)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock size={18} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Waktu</p>
                <p className="text-gray-600">
                  {booking.waktu_mulai} - {booking.waktu_selesai}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Users size={18} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Jumlah Orang</p>
                <p className="text-gray-600">{booking.jumlah_orang} Orang</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
            <div className="flex items-start">
              <User size={18} className="text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Pemesan</p>
                <p className="text-gray-600">{booking.user?.name}</p>
              </div>
            </div>

            {booking.user?.pelanggan && (
              <>
                <div className="flex items-start">
                  <Phone size={18} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Nomor Telepon</p>
                    <p className="text-gray-600">
                      {booking.user.pelanggan.no_hp}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Alamat</p>
                    <p className="text-gray-600">
                      {booking.user.pelanggan.alamat}
                    </p>
                  </div>
                </div>
              </>
            )}

            {booking.catatan && (
              <div className="flex items-start">
                <FileText size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Catatan</p>
                  <p className="text-gray-600">{booking.catatan}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Harga Fasilitas</p>
              <p>{showRupiah(booking.fasilitas?.harga || 0)}</p>
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2 mt-2">
              <p>Total</p>
              <p className="text-primary">{showRupiah(booking.total_harga)}</p>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <CreditCard size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-600">Status Pembayaran:</span>
              </div>
              {getPaymentStatusBadge(booking.status_pembayaran)}
            </div>
          </div>

          {booking.status === "menunggu" &&
            booking.status_pembayaran === "belum_dibayar" && (
              <div className="mt-6 space-y-3">
                <Button variant="primary" size="lg" className="w-full">
                  Bayar Sekarang
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-red-500 border-red-500 hover:bg-red-50"
                >
                  Batalkan Pemesanan
                </Button>
              </div>
            )}

          {booking.status === "dikonfirmasi" &&
            booking.status_pembayaran === "dibayar" && (
              <div className="mt-6 space-y-3">
                {booking.barcode && (
                  <div className="flex justify-center p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={booking.barcode}
                      alt="Booking QR Code"
                      className="h-48 w-48"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
                <p className="text-center text-sm text-gray-600">
                  Tunjukkan barcode ini kepada petugas saat check-in
                </p>
              </div>
            )}
        </Card>
      </FadeIn>
    </div>
  );
}

export default withAuth(FacilityBookingDetailPage);
