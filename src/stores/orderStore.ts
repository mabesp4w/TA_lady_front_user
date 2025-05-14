/** @format */
// src/stores/orderStore.ts
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";
import { PesananType } from "../types";
import { BASE_URL } from "@/services/baseURL";
import Cookies from "js-cookie";

interface OrderState {
  orders: PesananType[];
  currentOrder: PesananType | null;
  isLoading: boolean;
  error: string | null;

  // Methods
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<boolean>;
  checkOrderEligibility: () => Promise<{ eligible: boolean; message?: string }>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    // Check login status
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.data && response.data.status) {
        set({ orders: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data?.message || "Gagal mengambil data pesanan",
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      set({
        error: error.response?.data?.message || "Gagal mengambil data pesanan",
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (id: string) => {
    // Check login status
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.data && response.data.status) {
        set({ currentOrder: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data?.message || "Gagal mengambil detail pesanan",
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      set({
        error:
          error.response?.data?.message || "Gagal mengambil detail pesanan",
        isLoading: false,
      });
    }
  },

  checkOrderEligibility: async (): Promise<{
    eligible: boolean;
    message?: string;
  }> => {
    // Check login status
    const { user } = useAuthStore.getState();
    if (!user)
      return { eligible: false, message: "Silakan login terlebih dahulu" };

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/eligibility`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      set({ isLoading: false });
      return {
        eligible: response.data.status,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error checking order eligibility:", error);
      set({
        error:
          error.response?.data?.message ||
          "Gagal memeriksa eligibilitas pemesanan",
        isLoading: false,
      });
      return {
        eligible: false,
        message:
          error.response?.data?.message ||
          "Gagal memeriksa eligibilitas pemesanan",
      };
    }
  },

  cancelOrder: async (id: string) => {
    // Check login status
    const { user } = useAuthStore.getState();
    if (!user) return false;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.data && response.data.status) {
        // Refresh orders after cancellation
        await get().fetchOrders();
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: response.data?.message || "Gagal membatalkan pesanan",
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      set({
        error: error.response?.data?.message || "Gagal membatalkan pesanan",
        isLoading: false,
      });
      return false;
    }
  },
}));
