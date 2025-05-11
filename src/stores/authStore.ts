/** @format */

// src/stores/authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  token: Cookies.get("token") || null,

  login: async (email, password) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      Cookies.set("token", token, { expires: 7 });

      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        set({ isLoading: false });
        return false;
      }

      // Replace with your actual API endpoint
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ user: response.data.user, isLoading: false });
      return true;
    } catch (error) {
      console.log(error);
      Cookies.remove("token");
      set({ user: null, token: null, isLoading: false });
      return false;
    }
  },
}));
