/** @format */
// src/components/pages/cart/CartItem.tsx
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { KeranjangType } from "@/types";
import QuantitySelector from "@/components/pages/shop/QuantitySelector";
import Button from "@/components/ui/Button";
import showRupiah from "@/services/rupiah";
import { BASE_URL } from "@/services/baseURL";

interface CartItemProps {
  item: KeranjangType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, parseInt(item.jumlah as any) + 1);
  };

  const handleDecrement = () => {
    if (item.jumlah > 1) {
      onUpdateQuantity(item.id, parseInt(item.jumlah as any) - 1);
    }
  };

  const subtotal = (item.produk?.harga || 0) * parseInt(item.jumlah as any);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
      {/* Product Image */}
      {item.produk?.jalur_gambar ? (
        <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0">
          <Image
            src={`${BASE_URL}/${item.produk.jalur_gambar}`}
            alt={item.produk.nm_produk}
            fill
            sizes="(max-width: 768px) 96px, 128px"
            className="object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-200 flex items-center justify-center rounded-md flex-shrink-0">
          No Image
        </div>
      )}

      {/* Product Details */}
      <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{item.produk?.nm_produk}</h3>
          <p className="text-gray-600">{showRupiah(item.produk?.harga || 0)}</p>
        </div>

        {/* Quantity & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <QuantitySelector
            quantity={item.jumlah}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />

          <div className="flex flex-col items-end">
            <p className="font-bold text-primary mb-2">
              {showRupiah(subtotal)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => onRemove(item.id)}
              icon={<Trash2 size={16} />}
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
