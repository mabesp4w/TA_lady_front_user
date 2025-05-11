/** @format */

// src/stores/facilityStore.ts
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

export interface Facility {
  id: string;
  nm_fasilitas: string;
  deskripsi: string | null;
  harga: number;
  kapasitas: number | null;
  jam_buka: string;
  jam_tutup: string;
  tersedia: boolean;
  images?: FacilityImage[];
}

export interface FacilityImage {
  id: string;
  fasilitas_id: string;
  jalur_gambar: string;
  gambar_utama: boolean;
}

interface FacilityState {
  facilities: Facility[];
  selectedFacility: Facility | null;
  isLoading: boolean;
  fetchFacilities: () => Promise<void>;
  getFacility: (id: string) => Promise<void>;
}

export const useFacilityStore = create<FacilityState>((set) => ({
  facilities: [],
  selectedFacility: null,
  isLoading: false,

  fetchFacilities: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/facilities`);
      set({ facilities: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  getFacility: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/facilities/${id}`);
      set({ selectedFacility: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
}));
