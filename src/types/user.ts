/** @format */
// src/types/user.ts

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
  email_verified_at?: string;
  google_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PelangganInterface {
  id: string;
  user_id: string;
  nm_pelanggan: string;
  no_hp: string;
  alamat: string;
  foto_pelanggan?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileInterface {
  user: UserInterface;
  pelanggan: PelangganInterface;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  nm_pelanggan: string;
  no_hp: string;
  alamat: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}
