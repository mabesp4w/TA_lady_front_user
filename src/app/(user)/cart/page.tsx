/** @format */

// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import axios from "axios";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart } =
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Keranjang Belanja</h1>

      {cart.length > 0 ? (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg shadow-md p-4 flex"
              >
                <div className="relative h-20 w-20 flex-shrink-0">
                  {item.product.jalur_gambar ? (
                    <Image
                      src={item.product.jalur_gambar}
                      alt={item.product.nm_produk}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                      <ShoppingBag size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.product.nm_produk}</h3>
                    <button
                      className="text-red-500"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="text-primary font-bold mt-1">
                    Rp{item.product.harga.toLocaleString("id-ID")}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="px-2 py-1 bg-gray-100"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1
                            );
                          }
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-100"
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="font-bold">
                      Rp
                      {(item.product.harga * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rp{totalAmount.toLocaleString("id-ID")}</span>
              </div>

              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    Rp{totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg bg-primary text-white font-medium mt-4 ${
                isProcessing
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary-dark"
              }`}
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Memproses...
                </span>
              ) : (
                "Checkout"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
          <h2 className="text-xl font-semibold mt-4">
            Keranjang Belanja Kosong
          </h2>
          <p className="text-gray-500 mt-2">
            Tambahkan beberapa produk ke keranjang belanja Anda.
          </p>
          <button
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg"
            onClick={() => router.push("/shop")}
          >
            Belanja Sekarang
          </button>
        </div>
      )}
    </div>
  );
}
