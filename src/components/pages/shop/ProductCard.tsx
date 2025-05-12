/** @format */
// src/components/shop/ProductCard.tsx
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import Button from "@/components/ui/Button";

interface Product {
  id: string;
  nm_produk: string;
  harga: number;
  tersedia: boolean;
  jalur_gambar?: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
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
        <h2 className="font-semibold text-sm truncate">{product.nm_produk}</h2>
        <p className="text-primary font-bold mt-1">
          Rp{product.harga.toLocaleString("id-ID")}
        </p>

        {product.tersedia ? (
          <>
            <div className="flex items-center justify-between mt-2">
              <QuantitySelector
                quantity={quantity}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            </div>

            <Button
              variant="primary"
              className="mt-3 w-full text-sm"
              icon={<ShoppingCart size={16} />}
              onClick={onAddToCart}
            >
              Tambah
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            className="mt-3 w-full text-sm opacity-70"
            disabled
          >
            Habis
          </Button>
        )}
      </div>
    </div>
  );
}
