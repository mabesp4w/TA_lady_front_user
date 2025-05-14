/** @format */
// src/components/pages/bookings/OrdersList.tsx
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { PesananType } from "@/types";
import OrderCard from "../orders/OrderCard";

interface OrdersListProps {
  orders: PesananType[];
}

export default function OrdersList({ orders }: OrdersListProps) {
  const router = useRouter();

  const handleViewDetail = (id: string) => {
    router.push(`/orders/${id}`);
  };

  const handleCancelOrder = async (id: string) => {
    try {
      console.log({ id });
      // Import and use your order cancellation logic here
      // You can extract this from your previous OrderCard component
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={48} />}
        title="Belum ada pesanan produk"
        description="Anda belum memiliki pesanan produk."
        action={{
          label: "Belanja Sekarang",
          onClick: () => router.push("/shop"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetail={handleViewDetail}
          onCancel={() => handleCancelOrder(order.id)}
        />
      ))}
    </div>
  );
}
