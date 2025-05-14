/** @format */
// src/components/pages/cart/CartSummary.tsx
import Button from "@/components/ui/Button";

interface CartSummaryProps {
  totalAmount: number;
  onCheckout: () => void;
  isLoading: boolean;
}

export default function CartSummary({
  totalAmount,
  onCheckout,
  isLoading,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>

      <div className="border-t border-b py-4 my-4">
        <div className="flex justify-between mb-2">
          <span>Total Harga</span>
          <span>Rp{totalAmount.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total Pembayaran</span>
        <span className="text-primary">
          Rp{totalAmount.toLocaleString("id-ID")}
        </span>
      </div>

      <Button
        onClick={onCheckout}
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Memproses..." : "Checkout"}
      </Button>
    </div>
  );
}
