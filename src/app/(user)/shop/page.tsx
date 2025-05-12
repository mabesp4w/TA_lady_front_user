/** @format */
// src/app/shop/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/productStore";
import toast from "react-hot-toast";
import ProductFilter from "@/components/pages/shop/ProductFilter";
import ProductGrid from "@/components/pages/shop/ProductGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ShopPage() {
  const {
    products,
    categories,
    fetchProducts,
    fetchCategories,
    addToCart,
    isLoading,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

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

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    toast.success(`${product.nm_produk} ditambahkan ke keranjang`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat produk..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Toko Produk</h1>

      <ProductFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <ProductGrid
        products={filteredProducts}
        quantities={quantities}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
