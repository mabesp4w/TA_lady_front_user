/** @format */

// src/app/shop/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useProductStore } from "@/stores/productStore";
import toast from "react-hot-toast";
import { Search, Filter, ShoppingCart, Plus, Minus } from "lucide-react";

export default function ShopPage() {
  const { products, categories, fetchProducts, fetchCategories, addToCart } =
    useProductStore();
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Toko Produk</h1>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-300 appearance-none pl-10"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nm_kategori_produk}
              </option>
            ))}
          </select>
          <Filter className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {product.jalur_gambar ? (
              <div className="relative h-36">
                <Image
                  src={product.jalur_gambar}
                  alt={product.nm_produk}
                  fill
                  className="object-cover"
                />
                {!product.tersedia && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Habis
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-36 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}

            <div className="p-3">
              <h2 className="font-semibold text-sm truncate">
                {product.nm_produk}
              </h2>
              <p className="text-primary font-bold mt-1">
                Rp{product.harga.toLocaleString("id-ID")}
              </p>

              {product.tersedia && (
                <>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="px-2 py-1 bg-gray-100"
                        onClick={() => decrementQuantity(product.id)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1">
                        {quantities[product.id] || 1}
                      </span>
                      <button
                        className="px-2 py-1 bg-gray-100"
                        onClick={() => incrementQuantity(product.id)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="mt-3 w-full py-2 bg-primary text-white rounded-lg flex items-center justify-center text-sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={16} className="mr-1" />
                    Tambah
                  </button>
                </>
              )}

              {!product.tersedia && (
                <button
                  className="mt-3 w-full py-2 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center text-sm cursor-not-allowed"
                  disabled
                >
                  Habis
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Tidak ada produk yang sesuai dengan kriteria pencarian.
          </p>
        </div>
      )}
    </div>
  );
}
