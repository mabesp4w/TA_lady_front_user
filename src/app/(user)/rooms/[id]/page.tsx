/** @format */
// src/app/rooms/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ImageGallery from "@/components/pages/rooms/ImageGallery";
import RoomInfo from "@/components/pages/rooms/RoomInfo";
import BookingForm from "@/components/pages/rooms/BookingForm";
import LocationSection from "@/components/pages/rooms/LocationSection";
import PageContainer from "@/components/layout/PageContainer";
import FadeIn from "@/components/animation/FadeIn";
import { RoomBooking } from "@/stores/bookingStore";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { selectedRoom, getRoom, isLoading } = useRoomStore();
  const { createRoomBooking, error } = useBookingStore();
  const { user, checkAuth } = useAuthStore();

  const [isBookingLoading, setIsBookingLoading] = useState(false);

  useEffect(() => {
    getRoom(roomId);
    checkAuth();
  }, [roomId, getRoom, checkAuth]);

  const handleBookNow = async ({ checkIn, checkOut, totalPrice }: any) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    const booking = {
      kamar_id: selectedRoom?.id,
      tanggal_check_in: checkIn,
      tanggal_check_out: checkOut,
      total_harga: totalPrice,
    };

    setIsBookingLoading(true);

    try {
      const success = await createRoomBooking(booking as RoomBooking);

      if (success) {
        toast.success("Pemesanan berhasil dibuat");
        router.push("/bookings");
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Terjadi kesalahan saat membuat pemesanan");
    } finally {
      setIsBookingLoading(false);
    }
  };

  if (isLoading || !selectedRoom) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat detail kamar..." />
      </div>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <ImageGallery images={selectedRoom.gambar_kamar as any} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <RoomInfo room={selectedRoom} />
      </FadeIn>

      {selectedRoom.tersedia && (
        <FadeIn delay={0.2}>
          <BookingForm
            roomPrice={selectedRoom.jenis_kamar?.harga_per_malam || 0}
            onSubmit={handleBookNow}
            isLoading={isBookingLoading}
          />
        </FadeIn>
      )}

      <FadeIn delay={0.3}>
        <LocationSection />
      </FadeIn>
    </PageContainer>
  );
}
