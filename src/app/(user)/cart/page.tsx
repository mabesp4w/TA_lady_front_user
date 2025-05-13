/** @format */
// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import axios from "axios";
import CartItem from "@/components/pages/cart/CartItem";
import CartSummary from "@/components/pages/cart/CartSummary";
import EmptyCart from "@/components/pages/cart/EmptyCart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart, isLoading } =
    useProductStore();
  const { user, checkAuth } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const totalAmount = cart.reduce((total, item) => {
    return total + item.product.harga * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong");
      return;
    }

    setIsProcessing(true);

    try {
      // Create an order
      const orderData = {
        jenis_pesanan: "online",
        items: cart.map((item) => ({
          produk_id: item.product.id,
          jumlah: item.quantity,
          harga_satuan: item.product.harga,
          subtotal: item.product.harga * item.quantity,
        })),
        total_jumlah: totalAmount,
      };

      const response = await axios.post("/api/orders", orderData);
      if (response.data) {
        clearCart();
        router.push(`/orders/${response.data.id}`);
        toast.success("Pesanan berhasil dibuat");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Gagal memproses pesanan");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat keranjang..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Keranjang Belanja</h1>

      {cart.length > 0 ? (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item as any}
                onRemove={removeFromCart}
                onUpdateQuantity={updateCartQuantity}
              />
            ))}
          </div>

          <CartSummary
            totalAmount={totalAmount}
            onCheckout={handleCheckout}
            isProcessing={isProcessing}
          />
        </>
      ) : (
        <EmptyCart onShopNow={() => router.push("/shop")} />
      )}
    </div>
  );
}
