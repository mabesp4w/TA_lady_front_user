/** @format */
// src/components/shop/QuantitySelector.tsx
import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  minValue = 1,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={onDecrement}
        disabled={quantity <= minValue}
      >
        <Minus size={16} />
      </button>
      <span className="px-3 py-1">{quantity}</span>
      <button
        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={onIncrement}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
