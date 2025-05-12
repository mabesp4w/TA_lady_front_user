/** @format */
// src/components/cart/CartItem.tsx
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import QuantitySelector from "../shop/QuantitySelector";

interface CartItemProps {
  item: {
    product: {
      id: string;
      nm_produk: string;
      harga: number;
      jalur_gambar?: string;
    };
    quantity: number;
  };
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const { product, quantity } = item;
  const subtotal = product.harga * quantity;

  const handleIncrement = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex">
      <div className="relative h-20 w-20 flex-shrink-0">
        {product.jalur_gambar ? (
          <Image
            src={product.jalur_gambar}
            alt={product.nm_produk}
            fill
            className="object-cover rounded-md"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold">{product.nm_produk}</h3>
          <button
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={() => onRemove(product.id)}
            aria-label="Remove from cart"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <p className="text-primary font-bold mt-1">
          Rp{product.harga.toLocaleString("id-ID")}
        </p>

        <div className="flex justify-between items-center mt-2">
          <QuantitySelector
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />

          <p className="font-bold">Rp{subtotal.toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  );
}
