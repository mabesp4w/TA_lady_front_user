/** @format */

// src/stores/paymentStore.ts - Perbarui dengan opsi untuk menggunakan pembayaran yang sudah ada

import { create } from "zustand";
import toast from "react-hot-toast";
import {
  createPayment,
  getExistingPayment,
  openSnapMidtrans,
  MidtransPaymentOptions,
} from "@/services/midtransService";

interface PaymentState {
  isLoading: boolean;
  isMidtransScriptLoaded: boolean;
  error: string | null;
  // Actions
  setMidtransScriptLoaded: (loaded: boolean) => void;
  loadMidtransScript: () => void;
  handlePayment: (
    options: MidtransPaymentOptions & { useExisting?: boolean }
  ) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  isLoading: false,
  isMidtransScriptLoaded: false,
  error: null,

  setMidtransScriptLoaded: (loaded) => {
    set({ isMidtransScriptLoaded: loaded });
  },

  loadMidtransScript: () => {
    if (get().isMidtransScriptLoaded) return;
    // Cek jika script sudah ada di halaman
    if (
      typeof window !== "undefined" &&
      document.querySelector('script[src*="snap.js"]')
    ) {
      set({ isMidtransScriptLoaded: true });
      return;
    }

    try {
      const scriptUrl =
        process.env.NODE_ENV === "production"
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js";
      const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;

      script.onload = () => {
        set({ isMidtransScriptLoaded: true });
      };

      script.onerror = () => {
        set({ error: "Gagal memuat script Midtrans" });
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Error loading Midtrans script:", error);
      set({ error: "Gagal memuat script Midtrans" });
    }
  },

  handlePayment: async (options) => {
    const { paymentType, paymentId, useExisting = false } = options;

    // Load script if not loaded
    if (!get().isMidtransScriptLoaded) {
      get().loadMidtransScript();
      // If script is not loaded, show error and return
      if (!get().isMidtransScriptLoaded) {
        toast.error(
          "Midtrans script sedang dimuat, silakan coba lagi dalam beberapa detik"
        );
        return false;
      }
    }

    set({ isLoading: true, error: null });

    try {
      // Gunakan getExistingPayment jika useExisting=true, jika tidak gunakan createPayment
      let snapToken;

      if (useExisting) {
        snapToken = await getExistingPayment(paymentType, paymentId);
      } else {
        snapToken = await createPayment(paymentType, paymentId);
      }

      if (!snapToken) {
        toast.error("Gagal mendapatkan token pembayaran");
        set({ isLoading: false, error: "Gagal mendapatkan token pembayaran" });
        return false;
      }

      const success = openSnapMidtrans(snapToken, {
        onSuccess: (result) => {
          toast.success("Pembayaran berhasil");
          if (options.onSuccess) options.onSuccess(result);
        },
        onPending: (result) => {
          toast("Pembayaran dalam proses");
          if (options.onPending) options.onPending(result);
        },
        onError: (result) => {
          toast.error("Pembayaran gagal");
          if (options.onError) options.onError(result);
        },
        onClose: () => {
          toast(
            "Anda menutup popup pembayaran sebelum menyelesaikan transaksi"
          );
          if (options.onClose) options.onClose();
        },
      });

      if (!success) {
        toast.error("Midtrans belum siap, silakan coba lagi");
        set({ error: "Midtrans tidak tersedia" });
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Error handling payment:", error);
      toast.error("Terjadi kesalahan saat memproses pembayaran");
      set({
        error: error.message || "Terjadi kesalahan saat memproses pembayaran",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
