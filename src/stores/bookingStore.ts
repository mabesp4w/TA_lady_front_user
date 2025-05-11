/** @format */

// src/stores/bookingStore.ts
import { create } from "zustand";
import axios from "axios";
import { Room } from "./roomStore";
import { Facility } from "./facilityStore";
import { BASE_URL } from "@/services/baseURL";

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
  room?: Room;
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
  facility?: Facility;
}

interface BookingState {
  roomBookings: RoomBooking[];
  facilityBookings: FacilityBooking[];
  currentRoomBooking: RoomBooking | null;
  currentFacilityBooking: FacilityBooking | null;
  isLoading: boolean;

  fetchRoomBookings: () => Promise<void>;
  fetchFacilityBookings: () => Promise<void>;
  createRoomBooking: (booking: RoomBooking) => Promise<boolean>;
  createFacilityBooking: (booking: FacilityBooking) => Promise<boolean>;
  setCurrentRoomBooking: (booking: RoomBooking | null) => void;
  setCurrentFacilityBooking: (booking: FacilityBooking | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  roomBookings: [],
  facilityBookings: [],
  currentRoomBooking: null,
  currentFacilityBooking: null,
  isLoading: false,

  fetchRoomBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/room-bookings`);
      set({ roomBookings: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  fetchFacilityBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/facility-bookings`);
      set({ facilityBookings: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  createRoomBooking: async (booking) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/room-bookings`,
        booking
      );
      set((state) => ({
        roomBookings: [...state.roomBookings, response.data],
        currentRoomBooking: response.data,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      return false;
    }
  },

  createFacilityBooking: async (booking) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/facility-bookings`,
        booking
      );
      set((state) => ({
        facilityBookings: [...state.facilityBookings, response.data],
        currentFacilityBooking: response.data,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
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
