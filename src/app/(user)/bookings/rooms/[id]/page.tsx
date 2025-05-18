/** @format */
// src/app/bookings/rooms/[id]/page.tsx - Update to add payment button
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBookingStore } from "@/stores/bookingStore";
import moment from "moment";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/animation/FadeIn";
import withAuth from "@/components/hoc/withAuth";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";
import { usePaymentStore } from "@/stores/paymentStore";
import showRupiah from "@/services/rupiah";

function RoomBookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const { selectedRoomBooking, getRoomBooking, cancelRoomBooking, isLoading } =
    useBookingStore();

  const {
    handlePayment,
    isLoading: isPaymentLoading,
    loadMidtransScript,
  } = usePaymentStore();

  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      getRoomBooking(bookingId);
    }
    // Load Midtrans script on component mount
    loadMidtransScript();
  }, [bookingId, getRoomBooking, loadMidtransScript]);

  const onPayment = async () => {
    await handlePayment({
      paymentType: "kamar",
      paymentId: bookingId,
      onSuccess: () => {
        getRoomBooking(bookingId); // Refresh data setelah pembayaran berhasil
      },
      onPending: () => {
        getRoomBooking(bookingId); // Refresh data setelah pembayaran pending
      },
    });
  };

  if (isLoading || !selectedRoomBooking) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat detail pesanan..." />
      </div>
    );
  }

  const handleCancel = async () => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      setIsActionLoading(true);

      try {
        const success = await cancelRoomBooking(bookingId);

        if (success) {
          toast.success("Pesanan berhasil dibatalkan");
        } else {
          toast.error("Gagal membatalkan pesanan");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Terjadi kesalahan saat membatalkan pesanan");
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format("DD MMMM YYYY");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      menunggu: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Menunggu Konfirmasi",
      },
      dikonfirmasi: {
        color: "bg-blue-100 text-blue-800",
        text: "Dikonfirmasi",
      },
      check_in: { color: "bg-green-100 text-green-800", text: "Check In" },
      check_out: { color: "bg-purple-100 text-purple-800", text: "Check Out" },
      dibatalkan: { color: "bg-red-100 text-red-800", text: "Dibatalkan" },
    };

    const statusInfo = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      belum_dibayar: {
        color: "bg-red-100 text-red-800",
        text: "Belum Dibayar",
      },
      dibayar: { color: "bg-green-100 text-green-800", text: "Dibayar" },
      dikembalikan: {
        color: "bg-purple-100 text-purple-800",
        text: "Dikembalikan",
      },
    };

    const statusInfo = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const isBookingCancellable = selectedRoomBooking.status === "menunggu";
  const isBookingPayable =
    selectedRoomBooking.status_pembayaran === "belum_dibayar" &&
    (selectedRoomBooking.status === "menunggu" ||
      selectedRoomBooking.status === "dikonfirmasi");

  // Menyimpan gambar utama dalam variabel
  const imageSrc =
    (selectedRoomBooking?.kamar?.gambar_kamar &&
      selectedRoomBooking?.kamar?.gambar_kamar.find((img) => img.gambar_utama)
        ?.jalur_gambar) ||
    selectedRoomBooking?.kamar?.gambar_kamar?.[0]?.jalur_gambar;
  return (
    <PageContainer>
      <FadeIn>
        <PageHeader
          title={`Kode Pemesanan Kamar: ${selectedRoomBooking.kode_pemesanan}`}
          actions={
            <Link
              href="/bookings"
              className="text-blue-500 hover:text-blue-600 underline hover:no-underline"
            >
              Kembali
            </Link>
          }
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Room Info */}
          {selectedRoomBooking.kamar && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                {selectedRoomBooking.kamar.gambar_kamar &&
                  selectedRoomBooking.kamar.gambar_kamar.length > 0 && (
                    <Image
                      width={500}
                      height={500}
                      src={`${BASE_URL}/${imageSrc}`}
                      alt={`Kamar ${selectedRoomBooking.kamar.no_kamar}`}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  )}
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedRoomBooking.kamar.jenis_kamar
                        ? selectedRoomBooking.kamar.jenis_kamar.nm_jenis_kamar
                        : "Kamar"}{" "}
                      {selectedRoomBooking.kamar.no_kamar}
                    </h3>
                    {selectedRoomBooking.kamar.jenis_kamar && (
                      <p className="text-gray-600">
                        Kapasitas:{" "}
                        {selectedRoomBooking.kamar.jenis_kamar.kapasitas} orang
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(selectedRoomBooking.status)}
                    {getPaymentStatusBadge(
                      selectedRoomBooking.status_pembayaran
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-medium">
                        {formatDate(selectedRoomBooking.tanggal_check_in)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-medium">
                        {formatDate(selectedRoomBooking.tanggal_check_out)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Harga</p>
                    <p className="text-lg font-bold">
                      {showRupiah(selectedRoomBooking.total_harga)}
                    </p>
                  </div>

                  {selectedRoomBooking.metode_pembayaran && (
                    <div>
                      <p className="text-sm text-gray-600">Metode Pembayaran</p>
                      <p className="font-medium capitalize">
                        {selectedRoomBooking.metode_pembayaran.replace(
                          /_/g,
                          " "
                        )}
                      </p>
                    </div>
                  )}

                  {selectedRoomBooking.barcode && (
                    <div className="pt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Barcode Pemesanan
                      </p>
                      <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: atob(selectedRoomBooking.barcode),
                          }}
                          className="w-64 h-64"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              {isBookingPayable && (
                <Button
                  variant="primary"
                  onClick={onPayment}
                  disabled={isActionLoading || isPaymentLoading}
                  isLoading={isPaymentLoading}
                >
                  Bayar Sekarang
                </Button>
              )}

              {isBookingCancellable && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  isLoading={isActionLoading}
                  disabled={isActionLoading}
                >
                  Batalkan Pesanan
                </Button>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Payment Information Section */}
      {selectedRoomBooking.pembayaran &&
        selectedRoomBooking.pembayaran.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Riwayat Pembayaran</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedRoomBooking.pembayaran.map((payment: any) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(payment.created_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Rp{payment.jumlah.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {payment.metode_pembayaran.replace(/_/g, " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            payment.status === "selesai"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "menunggu"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                          >
                            {payment.status === "selesai"
                              ? "Sukses"
                              : payment.status === "menunggu"
                              ? "Menunggu"
                              : "Gagal"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        )}
    </PageContainer>
  );
}

export default withAuth(RoomBookingDetailPage);
