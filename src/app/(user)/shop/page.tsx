/** @format */
// src/app/shop/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProductFilter from "@/components/pages/shop/ProductFilter";
import ProductGrid from "@/components/pages/shop/ProductGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ShopPage() {
  const router = useRouter();
  const { products, categories, fetchProducts, fetchCategories, isLoading } =
    useProductStore();
  const { addToCart } = useCartStore();
  const { user, checkAuth } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    // Periksa status login
    checkAuth();

    // Ambil produk dan kategori
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories, checkAuth]);

  useEffect(() => {
    // Initialize quantities
    const initialQuantities: Record<string, number> = {};
    products.forEach((product) => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nm_produk
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.kategori_produk_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const incrementQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrementQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleAddToCart = async (product: any) => {
    // Cek apakah user sudah login
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    const quantity = quantities[product.id] || 1;
    const success = await addToCart(product.id, quantity);

    if (success) {
      toast.success(`${product.nm_produk} ditambahkan ke keranjang`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Toko Produk</h1>

      <ProductFilter
        categories={categories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ProductGrid
        products={filteredProducts as any}
        quantities={quantities}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
