/** @format */
// src/app/cart/page.tsx
"use client";

import { useEffect } from "react";
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
    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong");
      return;
    }

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

      if (response.data) {
        clearCart();
        router.push(`/orders/${response.data.id}`);
        toast.success("Pesanan berhasil dibuat");
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Gagal memproses pesanan");
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

          <CartSummary totalAmount={totalAmount} onCheckout={handleCheckout} />
        </>
      ) : (
        <EmptyCart onContinueShopping={() => router.push("/shop")} />
      )}
    </div>
  );
}

export default withAuth(CartPage);
