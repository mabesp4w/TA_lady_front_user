/** @format */

// src/components/pages/orders/EmptyOrders.tsx
import Image from "next/image";
import Button from "@/components/ui/Button";

interface EmptyOrdersProps {
  onContinueShopping: () => void;
}

const EmptyOrders = ({ onContinueShopping }: EmptyOrdersProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg shadow-sm bg-white">
      <div className="relative w-40 h-40 mb-4">
        <Image
          src="/images/empty-orders.svg" // You'll need to provide this image
          alt="Empty Orders"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">Belum Ada Pesanan</h2>
      <p className="text-gray-500 text-center mb-6">
        Anda belum memiliki pesanan. Mulai belanja sekarang!
      </p>
      <Button onClick={onContinueShopping} variant="primary">
        Mulai Belanja
      </Button>
    </div>
  );
};

export default EmptyOrders;
