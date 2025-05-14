/** @format */
// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";
import axios from "axios";
import CartItem from "@/components/pages/cart/CartItem";
import CartSummary from "@/components/pages/cart/CartSummary";
import EmptyCart from "@/components/pages/cart/EmptyCart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BASE_URL } from "@/services/baseURL";
import withAuth from "@/components/hoc/withAuth";
import Cookies from "js-cookie";
import Alert from "@/components/ui/Alert";

function CartPage() {
  const router = useRouter();
  const {
    cart,
    fetchCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    isLoading,
  } = useCartStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Efek terpisah untuk mengambil keranjang atau redirect
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalAmount = cart.reduce((total, item) => {
    return total + (item.produk?.harga || 0) * item.jumlah;
  }, 0);

  const handleUpdateQuantity = (id: string, jumlah: number) => {
    updateCartItem(id, jumlah);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success("Item berhasil dihapus dari keranjang");
  };

  const handleCheckout = async () => {
    // Scroll to the top of the page smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      // Create an order
      const orderData = {
        jenis_pesanan: "online",
        items: cart.map((item) => ({
          produk_id: item.produk_id,
          jumlah: item.jumlah,
          harga_satuan: item.produk?.harga || 0,
          subtotal: (item.produk?.harga || 0) * item.jumlah,
        })),
        total_jumlah: totalAmount,
      };

      const response = await axios.post(`${BASE_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.data && response.data.status) {
        clearCart();
        router.push(`/orders/${response.data.data.id}`);
        toast.success("Pesanan berhasil dibuat");
      } else {
        setCheckoutError(response.data?.message || "Gagal memproses pesanan");
        // Ensure we scroll to top again after setting the error
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      setCheckoutError(
        error.response?.data?.message || "Gagal memproses pesanan"
      );
      // Ensure we scroll to top again after setting the error
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

      {checkoutError && (
        <Alert
          variant="error"
          title="Gagal Membuat Pesanan"
          message={checkoutError}
          className="mb-4"
        />
      )}

      {cart.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item as any}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <CartSummary
            totalAmount={totalAmount}
            onCheckout={handleCheckout}
            isLoading={checkoutLoading}
          />

          <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            <p className="font-semibold mb-2">Informasi Pemesanan:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Pesanan hanya dapat dibuat saat Anda sedang check-in di kamar
                atau menggunakan fasilitas.
              </li>
              <li>Pastikan Anda telah menyelesaikan pesanan sebelumnya.</li>
              <li>Pembayaran dapat dilakukan saat pesanan selesai diproses.</li>
            </ul>
          </div>
        </>
      ) : (
        <EmptyCart onContinueShopping={() => router.push("/shop")} />
      )}
    </div>
  );
}

export default withAuth(CartPage);
