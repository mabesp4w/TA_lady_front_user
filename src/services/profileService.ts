/** @format */

// src/services/profileService.ts

import axios from "axios";
import { BASE_URL } from "./baseURL";
import Cookies from "js-cookie";
import {
  ProfileInterface,
  UpdateProfileData,
  UpdatePasswordData,
} from "@/types/user";

/**
 * Mendapatkan data profil pengguna
 */
export const getProfile = async (): Promise<ProfileInterface> => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.status) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch profile");
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Error fetching profile"
    );
  }
};

/**
 * Mengupdate data profil pengguna
 */
export const updateProfile = async (
  data: UpdateProfileData
): Promise<ProfileInterface> => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(`${BASE_URL}/api/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.status) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to update profile");
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Error updating profile"
    );
  }
};

/**
 * Mengupdate password pengguna
 */
export const updatePassword = async (
  data: UpdatePasswordData
): Promise<boolean> => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(`${BASE_URL}/api/profile/password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data && response.data.status;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error updating password"
    );
  }
};

/**
 * Mengupload foto profil pengguna
 */
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("foto_pelanggan", file);

    const response = await axios.post(
      `${BASE_URL}/api/profile/photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data && response.data.status) {
      return response.data.data.foto_pelanggan;
    }

    throw new Error(response.data.message || "Failed to upload profile photo");
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error uploading profile photo"
    );
  }
};
