/** @format */

// src/stores/bookingStore.ts
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";
import Cookies from "js-cookie";
import {
  FasilitasType,
  KamarType,
  PemesananKamarType,
  PemesananFasilitasType,
} from "@/types";

export interface RoomBooking {
  id?: string;
  user_id?: string;
  kamar_id: string;
  tanggal_check_in: string;
  tanggal_check_out: string;
  total_harga: number;
  kode_pemesanan?: string;
  status?: string;
  metode_pembayaran?: string;
  status_pembayaran?: string;
  room?: KamarType;
}

export interface FacilityBooking {
  id?: string;
  user_id?: string;
  fasilitas_id: string;
  tanggal_pemesanan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  jumlah_orang: number;
  total_harga: number;
  kode_pemesanan?: string;
  status?: string;
  metode_pembayaran?: string;
  status_pembayaran?: string;
  facility?: FasilitasType;
}

interface BookingState {
  roomBookings: PemesananKamarType[];
  facilityBookings: PemesananFasilitasType[];
  selectedRoomBooking: PemesananKamarType | null;
  selectedFacilityBooking: PemesananFasilitasType | null;
  currentRoomBooking: RoomBooking | null;
  currentFacilityBooking: FacilityBooking | null;
  isLoading: boolean;
  error: string | null;

  fetchRoomBookings: () => Promise<void>;
  fetchFacilityBookings: () => Promise<void>;
  getRoomBooking: (id: string) => Promise<void>;
  getFacilityBooking: (id: string) => Promise<void>;
  createRoomBooking: (booking: RoomBooking) => Promise<boolean>;
  createFacilityBooking: (booking: FacilityBooking) => Promise<boolean>;
  cancelRoomBooking: (id: string) => Promise<boolean>;
  cancelFacilityBooking: (id: string) => Promise<boolean>;
  payRoomBooking: (id: string, paymentMethod: string) => Promise<boolean>;
  payFacilityBooking: (id: string, paymentMethod: string) => Promise<boolean>;
  setCurrentRoomBooking: (booking: RoomBooking | null) => void;
  setCurrentFacilityBooking: (booking: FacilityBooking | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  roomBookings: [],
  facilityBookings: [],
  selectedRoomBooking: null,
  selectedFacilityBooking: null,
  currentRoomBooking: null,
  currentFacilityBooking: null,
  isLoading: false,
  error: null,

  fetchRoomBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/room-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success" && response.data.data) {
        set({ roomBookings: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data.message || "Failed to fetch room bookings",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching room bookings:", error);
      set({
        error: "Failed to fetch room bookings. Please try again later.",
        isLoading: false,
      });
    }
  },

  fetchFacilityBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/facility-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success" && response.data.data) {
        set({ facilityBookings: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data.message || "Failed to fetch facility bookings",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching facility bookings:", error);
      set({
        error: "Failed to fetch facility bookings. Please try again later.",
        isLoading: false,
      });
    }
  },

  getRoomBooking: async (id: string) => {
    set({ isLoading: true, error: null, selectedRoomBooking: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/room-bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success" && response.data.data) {
        set({ selectedRoomBooking: response.data.data, isLoading: false });
      } else {
        set({
          error:
            response.data.message || "Failed to fetch room booking details",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(`Error fetching room booking with id ${id}:`, error);
      set({
        error: "Failed to fetch room booking details. Please try again later.",
        isLoading: false,
      });
    }
  },

  getFacilityBooking: async (id: string) => {
    set({ isLoading: true, error: null, selectedFacilityBooking: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/facility-bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success" && response.data.data) {
        set({ selectedFacilityBooking: response.data.data, isLoading: false });
      } else {
        set({
          error:
            response.data.message || "Failed to fetch facility booking details",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(`Error fetching facility booking with id ${id}:`, error);
      set({
        error:
          "Failed to fetch facility booking details. Please try again later.",
        isLoading: false,
      });
    }
  },

  createRoomBooking: async (booking) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return false;
      }

      const response = await axios.post(
        `${BASE_URL}/api/room-bookings`,
        booking,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success" && response.data.data) {
        set((state) => ({
          roomBookings: [...state.roomBookings, response.data.data],
          currentRoomBooking: response.data.data,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        set({
          error: response.data.message || "Failed to create room booking",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error creating room booking:", error);

      if (axios.isAxiosError(error) && error.response) {
        set({
          error: error.response.data.message || "Failed to create room booking",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to create room booking. Please try again later.",
          isLoading: false,
        });
      }
      return false;
    }
  },

  createFacilityBooking: async (bookingData) => {
    set({ isLoading: true, error: null });

    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return false;
      }

      const response = await axios.post(
        `${BASE_URL}/api/facility-bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success" && response.data.data) {
        set((state) => ({
          facilityBookings: [...state.facilityBookings, response.data.data],
          currentFacilityBooking: response.data.data,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        set({
          error: response.data.message || "Failed to create facility booking",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error creating facility booking:", error);

      if (axios.isAxiosError(error) && error.response) {
        set({
          error:
            error.response.data.message || "Failed to create facility booking",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to create facility booking. Please try again later.",
          isLoading: false,
        });
      }
      return false;
    }
  },

  cancelRoomBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return false;
      }

      const response = await axios.put(
        `${BASE_URL}/api/room-bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Update the room booking in the list
        set((state) => ({
          roomBookings: state.roomBookings.map((booking) =>
            booking.id === id ? { ...booking, status: "dibatalkan" } : booking
          ),
          selectedRoomBooking:
            state.selectedRoomBooking?.id === id
              ? { ...state.selectedRoomBooking, status: "dibatalkan" }
              : state.selectedRoomBooking,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        set({
          error: response.data.message || "Failed to cancel room booking",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error(`Error cancelling room booking with id ${id}:`, error);

      if (axios.isAxiosError(error) && error.response) {
        set({
          error: error.response.data.message || "Failed to cancel room booking",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to cancel room booking. Please try again later.",
          isLoading: false,
        });
      }
      return false;
    }
  },

  cancelFacilityBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return false;
      }

      const response = await axios.put(
        `${BASE_URL}/api/facility-bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Update the facility booking in the list
        set((state) => ({
          facilityBookings: state.facilityBookings.map((booking) =>
            booking.id === id ? { ...booking, status: "dibatalkan" } : booking
          ),
          selectedFacilityBooking:
            state.selectedFacilityBooking?.id === id
              ? { ...state.selectedFacilityBooking, status: "dibatalkan" }
              : state.selectedFacilityBooking,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        set({
          error: response.data.message || "Failed to cancel facility booking",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error(`Error cancelling facility booking with id ${id}:`, error);

      if (axios.isAxiosError(error) && error.response) {
        set({
          error:
            error.response.data.message || "Failed to cancel facility booking",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to cancel facility booking. Please try again later.",
          isLoading: false,
        });
      }
      return false;
    }
  },

  payRoomBooking: async (id: string, paymentMethod: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return false;
      }

      const response = await axios.post(
        `${BASE_URL}/api/room-bookings/${id}/payment`,
        {
          metode_pembayaran: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success" && response.data.data) {
        // Update the room booking in the list
        await get().getRoomBooking(id);
        await get().fetchRoomBookings();
        return true;
      } else {
        set({
          error: response.data.message || "Failed to process payment",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error(`Error processing payment for room booking ${id}:`, error);

      if (axios.isAxiosError(error) && error.response) {
        set({
          error: error.response.data.message || "Failed to process payment",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to process payment. Please try again later.",
          isLoading: false,
        });
      }
      return false;
    }
  },

  payFacilityBooking: async (id: string, paymentMethod: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get("token");

      if (!token) {
        set({ error: "Authentication required", isLoading: false });
        return false;
      }

      const response = await axios.post(
        `${BASE_URL}/api/facility-bookings/${id}/payment`,
        {
          metode_pembayaran: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success" && response.data.data) {
        // Update the facility booking in the list
        await get().getFacilityBooking(id);
        await get().fetchFacilityBookings();
        return true;
      } else {
        set({
          error: response.data.message || "Failed to process payment",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error(
        `Error processing payment for facility booking ${id}:`,
        error
      );

      if (axios.isAxiosError(error) && error.response) {
        set({
          error: error.response.data.message || "Failed to process payment",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to process payment. Please try again later.",
          isLoading: false,
        });
      }
      return false;
    }
  },

  setCurrentRoomBooking: (booking) => {
    set({ currentRoomBooking: booking });
  },

  setCurrentFacilityBooking: (booking) => {
    set({ currentFacilityBooking: booking });
  },
}));
