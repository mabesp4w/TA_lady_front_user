/** @format */
// src/app/payment/status/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/animation/FadeIn";
import withAuth from "@/components/hoc/withAuth";
import { BsCheckCircleFill, BsXCircleFill, BsClockFill } from "react-icons/bs";
import moment from "moment";

function PaymentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Silakan login terlebih dahulu");
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status && response.data.data) {
          setPaymentData(response.data.data.payment);
          setTransactionData(response.data.data.transaction);
        } else {
          toast.error(
            response.data.message || "Gagal memuat status pembayaran"
          );
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        toast.error("Terjadi kesalahan saat memuat status pembayaran");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId, router]);

  const getStatusInfo = () => {
    if (!paymentData) return { icon: null, text: "", className: "" };

    const status = paymentData.status;

    if (status === "selesai") {
      return {
        icon: <BsCheckCircleFill size={64} className="text-green-500" />,
        text: "Pembayaran Berhasil",
        className: "text-green-700",
      };
    } else if (status === "menunggu") {
      return {
        icon: <BsClockFill size={64} className="text-yellow-500" />,
        text: "Menunggu Pembayaran",
        className: "text-yellow-700",
      };
    } else {
      return {
        icon: <BsXCircleFill size={64} className="text-red-500" />,
        text: "Pembayaran Gagal",
        className: "text-red-700",
      };
    }
  };

  const handleBackToBooking = () => {
    const type = getBookingType();
    const bookingId = getBookingId();

    if (type && bookingId) {
      router.push(`/bookings/${type}/${bookingId}`);
    } else {
      router.push("/bookings");
    }
  };

  const getBookingType = () => {
    if (!paymentData) return null;

    if (paymentData.jenis_pembayaran === "kamar") {
      return "rooms";
    } else if (paymentData.jenis_pembayaran === "fasilitas") {
      return "facilities";
    } else {
      return null;
    }
  };

  const getBookingId = () => {
    if (!paymentData) return null;

    if (paymentData.payable_id) {
      return paymentData.payable_id;
    } else if (paymentData.pesanan_id) {
      return paymentData.pesanan_id;
    } else {
      return null;
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format("DD MMMM YYYY, HH:mm:ss");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat status pembayaran..." />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <PageContainer>
        <FadeIn>
          <PageHeader title="Status Pembayaran" />

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <BsXCircleFill size={64} className="text-red-500 mx-auto" />
              <h3 className="text-xl font-semibold text-red-700 mt-4">
                Data Pembayaran Tidak Ditemukan
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Data pembayaran yang Anda cari tidak ditemukan atau Anda tidak
              memiliki akses.
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push("/bookings")}
            >
              Kembali ke Daftar Pesanan
            </Button>
          </div>
        </FadeIn>
      </PageContainer>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader title="Status Pembayaran" />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Status Section */}
          <div className="text-center p-8 border-b border-gray-200">
            <div className="inline-block mb-4">{statusInfo.icon}</div>
            <h2 className={`text-2xl font-bold ${statusInfo.className}`}>
              {statusInfo.text}
            </h2>
            {paymentData.status === "menunggu" && paymentData.expiry_time && (
              <p className="text-gray-600 mt-2">
                Selesaikan pembayaran sebelum{" "}
                {formatDate(paymentData.expiry_time)}
              </p>
            )}
          </div>

          {/* Payment Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detail Pembayaran</h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">ID Pembayaran</span>
                <span className="font-medium">{paymentData.id}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Jumlah</span>
                <span className="font-medium">
                  Rp{parseFloat(paymentData.jumlah).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-medium capitalize">
                  {paymentData.metode_pembayaran.replace(/_/g, " ")}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-medium">
                  {formatDate(paymentData.created_at)}
                </span>
              </div>

              {transactionData && (
                <>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">
                      {transactionData.order_id}
                    </span>
                  </div>

                  {transactionData.transaction_id && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-medium">
                        {transactionData.transaction_id}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Payment Instructions */}
            {paymentData.status === "menunggu" &&
              paymentData.detail_pembayaran && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Instruksi Pembayaran
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    {paymentData.metode_pembayaran === "bank_transfer" && (
                      <>
                        <p className="font-medium">
                          Transfer Bank{" "}
                          {paymentData.detail_pembayaran.bank.toUpperCase()}
                        </p>
                        <p className="mt-2">
                          Nomor Virtual Account:{" "}
                          <span className="font-mono font-medium">
                            {paymentData.detail_pembayaran.va_number}
                          </span>
                        </p>
                        <div className="mt-4 space-y-2">
                          <p className="font-medium">Cara Pembayaran:</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>
                              Login ke aplikasi mobile banking atau internet
                              banking Anda
                            </li>
                            <li>Pilih menu Transfer atau Pembayaran</li>
                            <li>
                              Pilih Virtual Account atau Transfer ke Bank{" "}
                              {paymentData.detail_pembayaran.bank.toUpperCase()}
                            </li>
                            <li>
                              Masukkan nomor Virtual Account:{" "}
                              {paymentData.detail_pembayaran.va_number}
                            </li>
                            <li>
                              Masukkan jumlah pembayaran: Rp
                              {parseFloat(paymentData.jumlah).toLocaleString(
                                "id-ID"
                              )}
                            </li>
                            <li>Konfirmasi dan selesaikan transaksi</li>
                          </ol>
                        </div>
                      </>
                    )}

                    {paymentData.metode_pembayaran === "gopay" && (
                      <>
                        <p className="font-medium">Pembayaran GoPay</p>
                        <div className="flex justify-center my-4">
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-center mb-2">Scan QR Code</p>
                            <img
                              src="/images/dummy-qr-code.png"
                              alt="QR Code GoPay"
                              className="w-40 h-40 mx-auto"
                            />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="font-medium">Cara Pembayaran:</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Buka aplikasi Gojek di ponsel Anda</li>
                            <li>Pilih menu Pay atau Bayar</li>
                            <li>Pilih Scan QR Code dan scan kode QR di atas</li>
                            <li>
                              Konfirmasi jumlah pembayaran: Rp
                              {parseFloat(paymentData.jumlah).toLocaleString(
                                "id-ID"
                              )}
                            </li>
                            <li>Masukkan PIN GoPay Anda</li>
                            <li>Transaksi selesai</li>
                          </ol>
                        </div>
                      </>
                    )}

                    {paymentData.metode_pembayaran === "credit_card" && (
                      <>
                        <p className="font-medium">Pembayaran Kartu Kredit</p>
                        <p className="mt-2">
                          Silakan gunakan Snap Token untuk melanjutkan
                          pembayaran dengan kartu kredit Anda.
                        </p>
                        <div className="mt-4">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              window.open(
                                "https://app.sandbox.midtrans.com/snap/v2/vtweb/" +
                                  paymentData.snap_token
                              )
                            }
                          >
                            Lanjutkan Pembayaran
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Default instructions if specific method not handled */}
                    {!["bank_transfer", "gopay", "credit_card"].includes(
                      paymentData.metode_pembayaran
                    ) && (
                      <>
                        <p className="font-medium capitalize">
                          Pembayaran{" "}
                          {paymentData.metode_pembayaran.replace(/_/g, " ")}
                        </p>
                        <p className="mt-2">
                          Gunakan Snap Token berikut untuk melanjutkan
                          pembayaran:
                        </p>
                        <p className="mt-1 font-mono bg-gray-100 p-2 rounded">
                          {paymentData.snap_token}
                        </p>
                        <div className="mt-4">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              window.open(
                                "https://app.sandbox.midtrans.com/snap/v2/vtweb/" +
                                  paymentData.snap_token
                              )
                            }
                          >
                            Lanjutkan Pembayaran
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200">
            <Button variant="secondary" onClick={handleBackToBooking}>
              Kembali ke Detail Pesanan
            </Button>

            {paymentData.status === "menunggu" && (
              <Button
                variant="primary"
                className="ml-4"
                onClick={() =>
                  window.open(
                    "https://app.sandbox.midtrans.com/snap/v2/vtweb/" +
                      paymentData.snap_token
                  )
                }
              >
                Lanjutkan Pembayaran
              </Button>
            )}
          </div>
        </div>
      </FadeIn>
    </PageContainer>
  );
}

export default withAuth(PaymentStatusPage);
