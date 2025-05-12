/** @format */
// src/components/cart/CartSummary.tsx
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface CartSummaryProps {
  totalAmount: number;
  onCheckout: () => void;
  isProcessing: boolean;
}

export default function CartSummary({
  totalAmount,
  onCheckout,
  isProcessing,
}: CartSummaryProps) {
  return (
    <Card>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>Rp{totalAmount.toLocaleString("id-ID")}</span>
        </div>

        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">
              Rp{totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-4"
        onClick={onCheckout}
        isLoading={isProcessing}
        disabled={isProcessing || totalAmount <= 0}
      >
        Checkout
      </Button>
    </Card>
  );
}
