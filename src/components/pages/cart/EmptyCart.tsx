/** @format */
// src/components/pages/cart/EmptyCart.tsx
import { ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyCartProps {
  onContinueShopping: () => void;
}

export default function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <ShoppingCart size={64} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Keranjang Anda Kosong</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Sepertinya Anda belum menambahkan produk apapun ke keranjang Anda
      </p>
      <Button onClick={onContinueShopping}>Lanjutkan Belanja</Button>
    </div>
  );
}
