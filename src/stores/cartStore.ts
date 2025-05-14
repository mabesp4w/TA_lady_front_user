/** @format */

// src/stores/cartStore.ts
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";
import { KeranjangType } from "../types";
import { BASE_URL } from "@/services/baseURL";
import Cookies from "js-cookie";

interface CartState {
  cart: KeranjangType[];
  isLoading: boolean;
  error: string | null;

  // Methods
  fetchCart: () => Promise<void>;
  addToCart: (produkId: string, jumlah: number) => Promise<boolean>;
  updateCartItem: (id: string, jumlah: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    // Cek status login
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/keranjang`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      set({ cart: response.data.data, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      set({
        error:
          error.response?.data?.message || "Gagal mengambil data keranjang",
        isLoading: false,
      });
    }
  },

  addToCart: async (produkId: string, jumlah: number) => {
    set({ isLoading: true, error: null });

    // Cek status login
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ isLoading: false, error: "Silakan login terlebih dahulu" });
      return false; // Return false jika gagal
    }

    try {
      await axios.post(
        `${BASE_URL}/api/keranjang`,
        { produk_id: produkId, jumlah },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      // Refresh keranjang setelah menambahkan item
      await get().fetchCart();
      set({ isLoading: false });
      return true; // Return true jika berhasil
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      set({
        error:
          error.response?.data?.message || "Gagal menambahkan ke keranjang",
        isLoading: false,
      });
      return false; // Return false jika gagal
    }
  },

  updateCartItem: async (id: string, jumlah: number) => {
    set({ isLoading: true, error: null });

    // Cek status login
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ isLoading: false, error: "Silakan login terlebih dahulu" });
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/keranjang/${id}`,
        { jumlah },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      // Refresh keranjang setelah update
      await get().fetchCart();
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      set({
        error: error.response?.data?.message || "Gagal memperbarui keranjang",
        isLoading: false,
      });
    }
  },

  removeFromCart: async (id: string) => {
    set({ isLoading: true, error: null });

    // Cek status login
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ isLoading: false, error: "Silakan login terlebih dahulu" });
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/keranjang/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      // Refresh keranjang setelah menghapus item
      await get().fetchCart();
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      set({
        error:
          error.response?.data?.message || "Gagal menghapus dari keranjang",
        isLoading: false,
      });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });

    // Cek status login
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ isLoading: false, error: "Silakan login terlebih dahulu" });
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/keranjang`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      set({ cart: [], isLoading: false });
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      set({
        error: error.response?.data?.message || "Gagal mengosongkan keranjang",
        isLoading: false,
      });
    }
  },
}));
