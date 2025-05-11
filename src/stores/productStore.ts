/** @format */

// src/stores/productStore.ts
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

export interface Product {
  id: string;
  kategori_produk_id: string;
  nm_produk: string;
  deskripsi: string | null;
  harga: number;
  jumlah_stok: number;
  jalur_gambar: string | null;
  tersedia: boolean;
  kategori?: ProductCategory;
}

export interface ProductCategory {
  id: string;
  nm_kategori_produk: string;
  deskripsi: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductState {
  products: Product[];
  categories: ProductCategory[];
  cart: CartItem[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  cart: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/categories`);
      set({ categories: response.data.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  addToCart: (product, quantity) => {
    const cart = [...get().cart];
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    set({ cart });
  },

  removeFromCart: (productId) => {
    const cart = get().cart.filter((item) => item.product.id !== productId);
    set({ cart });
  },

  updateCartQuantity: (productId, quantity) => {
    const cart = [...get().cart];
    const item = cart.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      set({ cart });
    }
  },

  clearCart: () => {
    set({ cart: [] });
  },
}));
