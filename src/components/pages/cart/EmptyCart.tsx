/** @format */
// src/components/cart/EmptyCart.tsx
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyCartProps {
  onShopNow: () => void;
}

export default function EmptyCart({ onShopNow }: EmptyCartProps) {
  return (
    <div className="text-center py-10 bg-white rounded-lg shadow-md">
      <ShoppingBag size={64} className="mx-auto text-gray-300" />
      <h2 className="text-xl font-semibold mt-4">Keranjang Belanja Kosong</h2>
      <p className="text-gray-500 mt-2">
        Tambahkan beberapa produk ke keranjang belanja Anda.
      </p>
      <Button variant="primary" className="mt-6" onClick={onShopNow}>
        Belanja Sekarang
      </Button>
    </div>
  );
}
