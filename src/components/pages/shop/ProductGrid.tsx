/** @format */
// src/components/shop/ProductGrid.tsx
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import EmptyState from "@/components/ui/EmptyState";

interface Product {
  id: string;
  nm_produk: string;
  harga: number;
  tersedia: boolean;
  jalur_gambar?: string;
}

interface ProductGridProps {
  products: Product[];
  quantities: Record<string, number>;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({
  products,
  quantities,
  onIncrement,
  onDecrement,
  onAddToCart,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Search size={48} />}
        title="Tidak ada produk yang ditemukan"
        description="Tidak ada produk yang sesuai dengan kriteria pencarian Anda."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities[product.id] || 1}
          onIncrement={() => onIncrement(product.id)}
          onDecrement={() => onDecrement(product.id)}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
}
