/** @format */
// src/app/bookings/orders/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import OrderDetails from "@/components/pages/orders/OrderDetails";
import OrderItems from "@/components/pages/orders/OrderItems";
import OrderPayment from "@/components/pages/orders/OrderPayment";
import withAuth from "@/components/hoc/withAuth";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";
import Cookies from "js-cookie";
import Link from "next/link";

function OrderDetailPage({ params }: { params: { id: string } }) {
  const { currentOrder, fetchOrderById, isLoading, error, cancelOrder } =
    useOrderStore();

  useEffect(() => {
    if (params.id) {
      fetchOrderById(params.id);
    }
  }, [params.id, fetchOrderById]);

  const handlePayment = async () => {
    if (!currentOrder) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/payments`,
        {
          pesanan_id: currentOrder.id,
          jumlah: currentOrder.total_jumlah,
          metode_pembayaran: "midtrans", // Assuming midtrans is your payment gateway
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.data && response.data.snap_token) {
        // This assumes you have Midtrans snap integration
        // You'll need to implement this function based on Midtrans documentation
        openMidtransSnap(response.data.snap_token);
      } else {
        toast.success("Pembayaran diproses");
        fetchOrderById(currentOrder.id); // Refresh order details
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error(
        error.response?.data?.message || "Gagal memproses pembayaran"
      );
    }
  };

  // This is a placeholder for Midtrans integration
  const openMidtransSnap = (snapToken: string) => {
    // You'd typically use the Midtrans Snap library here
    console.log("Opening Midtrans with token:", snapToken);
    toast("Redirecting to payment gateway...");
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;

    const success = await cancelOrder(currentOrder.id);
    if (success) {
      toast.success("Pesanan berhasil dibatalkan");
      fetchOrderById(currentOrder.id); // Refresh order details
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Memuat detail pesanan..." />
        </div>
      </PageContainer>
    );
  }

  if (error || !currentOrder) {
    return (
      <PageContainer>
        <PageHeader
          title="Detail Pesanan"
          actions={
            <Link
              href="/bookings"
              className="text-blue-500 underline hover:no-underline"
            >
              Kembali
            </Link>
          }
        />
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
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
          <Link
            href="/bookings"
            className="text-blue-500 underline hover:no-underline"
          >
            Kembali
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OrderDetails order={currentOrder} />
          <OrderItems items={currentOrder.item_pesanan || []} />
        </div>
        <div className="md:col-span-1">
          <OrderPayment
            order={currentOrder}
            onPayNow={handlePayment}
            onCancel={handleCancelOrder}
          />
        </div>
      </div>
    </PageContainer>
  );
}

export default withAuth(OrderDetailPage);
