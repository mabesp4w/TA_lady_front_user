/** @format */

// src/stores/roomStore.ts
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

export interface RoomType {
  id: string;
  nm_jenis_kamar: string;
  deskripsi: string | null;
  kapasitas: number;
  harga_per_malam: number;
}

export interface Room {
  id: string;
  jenis_kamar_id: string;
  no_kamar: string;
  tersedia: boolean;
  lantai: string;
  catatan: string | null;
  roomType?: RoomType;
  images?: RoomImage[];
}

export interface RoomImage {
  id: string;
  kamar_id: string;
  jalur_gambar: string;
  gambar_utama: boolean;
}

interface RoomState {
  rooms: Room[];
  roomTypes: RoomType[];
  selectedRoom: Room | null;
  isLoading: boolean;
  fetchRooms: () => Promise<void>;
  fetchRoomTypes: () => Promise<void>;
  getRoom: (id: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  roomTypes: [],
  selectedRoom: null,
  isLoading: false,

  fetchRooms: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/rooms`);
      set({ rooms: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  fetchRoomTypes: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/rooms/types`);
      set({ roomTypes: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  getRoom: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/rooms/${id}`);
      set({ selectedRoom: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
}));
