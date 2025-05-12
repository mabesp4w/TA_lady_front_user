/** @format */
// src/components/bookings/BookingsList.tsx
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import RoomBookingCard from "./RoomBookingCard";
import FacilityBookingCard from "./FacilityBookingCard";
import EmptyState from "@/components/ui/EmptyState";

interface BookingsListProps {
  type: "rooms" | "facilities";
  bookings: any[];
}

export default function BookingsList({ type, bookings }: BookingsListProps) {
  const router = useRouter();

  const handleViewDetail = (id: string) => {
    router.push(`/bookings/${type}/${id}`);
  };

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={48} />}
        title={`Belum ada pesanan ${type === "rooms" ? "kamar" : "fasilitas"}`}
        description={`Anda belum memiliki pesanan ${
          type === "rooms" ? "kamar" : "fasilitas"
        }.`}
        action={{
          label: `Pesan ${type === "rooms" ? "Kamar" : "Fasilitas"} Sekarang`,
          onClick: () =>
            router.push(type === "rooms" ? "/rooms" : "/facilities"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {type === "rooms"
        ? bookings.map((booking) => (
            <RoomBookingCard
              key={booking.id}
              booking={booking}
              onViewDetail={handleViewDetail}
            />
          ))
        : bookings.map((booking) => (
            <FacilityBookingCard
              key={booking.id}
              booking={booking}
              onViewDetail={handleViewDetail}
            />
          ))}
    </div>
  );
}
