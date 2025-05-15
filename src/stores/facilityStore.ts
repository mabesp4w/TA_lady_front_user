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

      if (response.data.status && response.data) {
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
      console.log(`Fetching facility with ID: ${id}`);

      const response = await axios.get<ApiResponse<FasilitasType>>(
        `${BASE_URL}/api/facilities/${id}`
      );

      console.log("API Response:", response.data);

      if (response.data.status && response.data.data) {
        set({ selectedFacility: response.data.data, isLoading: false });
      } else {
        // Store the exact error message from API
        set({
          error: response.data.message || "Failed to fetch facility details",
          isLoading: false,
        });
        console.error("API response error:", response.data);
      }
    } catch (error) {
      console.error(`Error fetching facility with id ${id}:`, error);

      // Better error handling for axios errors
      if (axios.isAxiosError(error) && error.response) {
        set({
          error:
            error.response.data.message || "Failed to fetch facility details",
          isLoading: false,
        });
      } else {
        set({
          error: "Failed to fetch facility details. Please try again later.",
          isLoading: false,
        });
      }
    }
  },
}));
