/** @format */

// src/services/midtransService.ts - Tambahkan fungsi baru untuk mengambil token pembayaran yang sudah ada

import axios from "axios";
import { BASE_URL } from "./baseURL";
import Cookies from "js-cookie";

// Definisikan tipe untuk parameter
export type PaymentType = "kamar" | "fasilitas" | "pesanan";

export interface MidtransPaymentOptions {
  paymentType: PaymentType;
  paymentId: string;
  onSuccess?: (result?: any) => void;
  onPending?: (result?: any) => void;
  onError?: (result?: any) => void;
  onClose?: () => void;
}

// Fungsi untuk membuat token pembayaran baru
export const createPayment = async (
  paymentType: PaymentType,
  paymentId: string
): Promise<string | null> => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const response = await axios.post(
      `${BASE_URL}/api/payments`,
      {
        jenis_pembayaran: paymentType,
        pembayaran_id: paymentId,
        metode_pembayaran: "midtrans",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status && response.data.data.snap_token) {
      return response.data.data.snap_token;
    }

    return null;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Fungsi baru untuk mengambil token pembayaran yang sudah ada
export const getExistingPayment = async (
  paymentType: PaymentType,
  paymentId: string
): Promise<string | null> => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const response = await axios.get(`${BASE_URL}/api/payments/existing`, {
      params: {
        jenis_pembayaran: paymentType,
        pembayaran_id: paymentId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status && response.data.data.snap_token) {
      return response.data.data.snap_token;
    }

    return null;
  } catch (error) {
    console.error("Error getting existing payment:", error);
    throw error;
  }
};

// Fungsi untuk menampilkan Snap Midtrans
export const openSnapMidtrans = (
  snapToken: string,
  options: Omit<MidtransPaymentOptions, "paymentType" | "paymentId">
) => {
  if (typeof window !== "undefined" && window.snap) {
    window.snap.pay(snapToken, {
      onSuccess: (result: any) => {
        if (options.onSuccess) options.onSuccess(result);
      },
      onPending: (result: any) => {
        if (options.onPending) options.onPending(result);
      },
      onError: (result: any) => {
        if (options.onError) options.onError(result);
      },
      onClose: () => {
        if (options.onClose) options.onClose();
      },
    });
    return true;
  }
  return false;
};

// Definisikan tipe global untuk window
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}
