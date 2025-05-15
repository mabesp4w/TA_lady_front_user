/** @format */
// src/stores/profileStore.ts

import { create } from "zustand";
import {
  ProfileInterface,
  UpdateProfileData,
  UpdatePasswordData,
} from "@/types/user";
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadProfilePhoto,
} from "@/services/profileService";

interface ProfileState {
  profile: ProfileInterface | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfileData: (data: UpdateProfileData) => Promise<boolean>;
  updatePasswordData: (data: UpdatePasswordData) => Promise<boolean>;
  uploadPhoto: (file: File) => Promise<boolean>;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profileData = await getProfile();
      set({ profile: profileData, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Gagal memuat profil",
        isLoading: false,
      });
    }
  },

  updateProfileData: async (data: UpdateProfileData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await updateProfile(data);
      set({ profile: updatedProfile, isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || "Gagal memperbarui profil",
        isLoading: false,
      });
      return false;
    }
  },

  updatePasswordData: async (data: UpdatePasswordData) => {
    set({ isLoading: true, error: null });
    try {
      const success = await updatePassword(data);
      set({ isLoading: false });
      return success;
    } catch (error: any) {
      set({
        error: error.message || "Gagal memperbarui password",
        isLoading: false,
      });
      return false;
    }
  },

  uploadPhoto: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const photoUrl = await uploadProfilePhoto(file);

      // Update profile with new photo URL
      if (get().profile) {
        const updatedProfile = {
          ...get().profile!,
          pelanggan: {
            ...get().profile!.pelanggan,
            foto_pelanggan: photoUrl,
          },
        };
        set({ profile: updatedProfile });
      }

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || "Gagal mengupload foto",
        isLoading: false,
      });
      return false;
    }
  },

  reset: () => {
    set({ profile: null, isLoading: false, error: null });
  },
}));
