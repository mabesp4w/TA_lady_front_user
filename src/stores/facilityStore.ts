/** @format */
// src/stores/facilityStore.ts
import { create } from "zustand";
import axios from "axios";
import { FasilitasType, ApiResponse } from "@/types";
import { BASE_URL } from "@/services/baseURL";

interface FacilityState {
  facilities: FasilitasType[];
  selectedFacility: FasilitasType | null;
  isLoading: boolean;
  error: string | null;
  fetchFacilities: () => Promise<void>;
  getFacility: (id: string) => Promise<void>;
}

export const useFacilityStore = create<FacilityState>((set) => ({
  facilities: [],
  selectedFacility: null,
  isLoading: false,
  error: null,

  fetchFacilities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<ApiResponse<FasilitasType[]>>(
        `${BASE_URL}/api/facilities`
      );

      if (response.data.status === "success" && response.data.data) {
        set({ facilities: response.data.data });
      } else {
        set({ error: response.data.message || "Failed to fetch facilities" });
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      set({ error: "Failed to fetch facilities. Please try again later." });
    } finally {
      set({ isLoading: false });
    }
  },

  getFacility: async (id: string) => {
    set({ isLoading: true, error: null, selectedFacility: null });
    try {
      const response = await axios.get<ApiResponse<FasilitasType>>(
        `${BASE_URL}/api/facilities/${id}`
      );

      if (response.data.status === "success" && response.data.data) {
        set({ selectedFacility: response.data.data });
      } else {
        set({ error: response.data.message || "Failed to fetch facility" });
      }
    } catch (error) {
      console.error(`Error fetching facility with id ${id}:`, error);
      set({
        error: "Failed to fetch facility details. Please try again later.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
