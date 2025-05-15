/** @format */
// src/app/bookings/facilities/[id]/page.tsx - Update to add payment functionality
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
import { usePaymentStore } from "@/stores/paymentStore";

function FacilityBookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const {
    selectedFacilityBooking,
    getFacilityBooking,
    cancelFacilityBooking,
    isLoading,
  } = useBookingStore();

  const {
    handlePayment,
    isLoading: isPaymentLoading,
    loadMidtransScript,
  } = usePaymentStore();

  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      getFacilityBooking(bookingId);
    }
    // Load Midtrans script on component mount
    loadMidtransScript();
  }, [bookingId, getFacilityBooking, loadMidtransScript]);

  const onPayment = async () => {
    await handlePayment({
      paymentType: "fasilitas",
      paymentId: bookingId,
      onSuccess: () => {
        getFacilityBooking(bookingId); // Refresh data setelah pembayaran berhasil
      },
      onPending: () => {
        getFacilityBooking(bookingId); // Refresh data setelah pembayaran pending
      },
    });
  };

  if (isLoading || !selectedFacilityBooking) {
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
        const success = await cancelFacilityBooking(bookingId);

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

  const formatTime = (time: string) => {
    return moment(time, "HH:mm:ss").format("HH:mm");
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
      digunakan: { color: "bg-green-100 text-green-800", text: "Digunakan" },
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

  const isBookingCancellable = selectedFacilityBooking.status === "menunggu";
  const isBookingPayable =
    selectedFacilityBooking.status_pembayaran === "belum_dibayar" &&
    (selectedFacilityBooking.status === "menunggu" ||
      selectedFacilityBooking.status === "dikonfirmasi");

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader
          title={`Kode Pemesanan: ${selectedFacilityBooking.kode_pemesanan}`}
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
          {/* Facility Info */}
          {selectedFacilityBooking.fasilitas && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                {selectedFacilityBooking.fasilitas.gambar_fasilitas &&
                  selectedFacilityBooking.fasilitas.gambar_fasilitas.length >
                    0 && (
                    <Image
                      width={500}
                      height={500}
                      src={
                        selectedFacilityBooking.fasilitas.gambar_fasilitas[0]
                          .jalur_gambar
                      }
                      alt={selectedFacilityBooking.fasilitas.nm_fasilitas}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  )}
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedFacilityBooking.fasilitas.nm_fasilitas}
                    </h3>
                    {selectedFacilityBooking.fasilitas.kapasitas && (
                      <p className="text-gray-600">
                        Kapasitas: {selectedFacilityBooking.fasilitas.kapasitas}{" "}
                        orang
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(selectedFacilityBooking.status)}
                    {getPaymentStatusBadge(
                      selectedFacilityBooking.status_pembayaran
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pemesanan</p>
                    <p className="font-medium">
                      {formatDate(selectedFacilityBooking.tanggal_pemesanan)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Waktu Mulai</p>
                      <p className="font-medium">
                        {formatTime(selectedFacilityBooking.waktu_mulai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Waktu Selesai</p>
                      <p className="font-medium">
                        {formatTime(selectedFacilityBooking.waktu_selesai)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Jumlah Orang</p>
                    <p className="font-medium">
                      {selectedFacilityBooking.jumlah_orang} orang
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Harga</p>
                    <p className="text-lg font-bold">
                      Rp
                      {selectedFacilityBooking.total_harga.toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>

                  {selectedFacilityBooking.metode_pembayaran && (
                    <div>
                      <p className="text-sm text-gray-600">Metode Pembayaran</p>
                      <p className="font-medium capitalize">
                        {selectedFacilityBooking.metode_pembayaran.replace(
                          /_/g,
                          " "
                        )}
                      </p>
                    </div>
                  )}

                  {selectedFacilityBooking.barcode && (
                    <div className="pt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Barcode Pemesanan
                      </p>
                      <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: atob(selectedFacilityBooking.barcode),
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
      {selectedFacilityBooking.pembayaran &&
        selectedFacilityBooking.pembayaran.length > 0 && (
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
                    {selectedFacilityBooking.pembayaran.map((payment: any) => (
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

export default withAuth(FacilityBookingDetailPage);
