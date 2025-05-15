/** @format */

// src/app/bookings/orders/[id]/page.tsx - Update OrderDetailPage

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrderStore } from "@/stores/orderStore";
import { usePaymentStore } from "@/stores/paymentStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import OrderDetails from "@/components/pages/orders/OrderDetails";
import OrderItems from "@/components/pages/orders/OrderItems";
import OrderPayment from "@/components/pages/orders/OrderPayment";
import withAuth from "@/components/hoc/withAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import FadeIn from "@/components/animation/FadeIn";

function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { currentOrder, fetchOrderById, isLoading, error, cancelOrder } =
    useOrderStore();

  const { handlePayment, loadMidtransScript } = usePaymentStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
    // Load Midtrans script pada saat komponen dimount
    loadMidtransScript();
  }, [orderId, fetchOrderById, loadMidtransScript]);

  const onPayment = async () => {
    if (!currentOrder) return;

    // Tentukan apakah ini pembayaran lanjutan atau baru
    const isExistingPayment =
      currentOrder.pembayaran &&
      currentOrder.pembayaran.length > 0 &&
      currentOrder.status_pembayaran === "belum_dibayar";

    await handlePayment({
      paymentType: "pesanan",
      paymentId: orderId,
      useExisting: isExistingPayment, // Gunakan pembayaran yang sudah ada jika ini adalah pembayaran lanjutan
      onSuccess: () => {
        fetchOrderById(orderId); // Refresh data setelah pembayaran berhasil
      },
      onPending: () => {
        fetchOrderById(orderId); // Refresh data setelah pembayaran pending
      },
      onError: () => {
        toast.error("Pembayaran gagal, silakan coba lagi");
      },
      onClose: () => {
        toast("Pembayaran dibatalkan");
      },
    });
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    const success = await cancelOrder(currentOrder.id);
    if (success) {
      toast.success("Pesanan berhasil dibatalkan");
      fetchOrderById(currentOrder.id); // Refresh order details
    }
  };

  if (isLoading || !currentOrder) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Detail Pesanan"
          actions={
            <Link
              href="/bookings"
              className="text-blue-500 hover:text-blue-600"
            >
              Kembali
            </Link>
          }
        />
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4">
          {error || "Pesanan tidak ditemukan"}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Detail Pesanan"
        actions={
          <Link href="/bookings" className="text-blue-500 hover:text-blue-600">
            Kembali
          </Link>
        }
      />

      <FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <OrderDetails order={currentOrder} />
            <div className="mt-6">
              <OrderItems items={currentOrder.item_pesanan || []} />
            </div>
          </div>

          <div>
            <OrderPayment
              order={currentOrder}
              onPayNow={onPayment}
              onCancel={handleCancelOrder}
            />
          </div>
        </div>
      </FadeIn>
    </PageContainer>
  );
}

export default withAuth(OrderDetailPage);
