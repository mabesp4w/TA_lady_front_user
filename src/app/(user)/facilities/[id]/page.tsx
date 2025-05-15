/** @format */
// src/app/facilities/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFacilityStore } from "@/stores/facilityStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FadeIn from "@/components/animation/FadeIn";
import PageContainer from "@/components/layout/PageContainer";
import { ArrowLeft } from "lucide-react";
import ImageGallery from "@/components/pages/facilities/ImageGallery";
import FacilityInfo from "@/components/pages/facilities/FacilityInfo";
import BookingForm from "@/components/pages/facilities/BookingForm";
import FacilityFeatures from "@/components/pages/facilities/FacilityFeatures";
import { FacilityBooking } from "@/stores/bookingStore";

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const facilityId = params.id as string;

  const { selectedFacility, getFacility, isLoading, error } =
    useFacilityStore();
  const { createFacilityBooking } = useBookingStore();
  const { user, checkAuth } = useAuthStore();

  const [isBookingLoading, setIsBookingLoading] = useState(false);

  useEffect(() => {
    if (!facilityId || facilityId === "undefined") {
      toast.error("ID fasilitas tidak valid");
      router.push("/facilities");
      return;
    }

    getFacility(facilityId);
    checkAuth();
  }, [getFacility, facilityId, router, checkAuth]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleBookNow = async ({
    date,
    startTime,
    endTime,
    people,
    totalPrice,
  }: any) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (!selectedFacility) {
      toast.error("Data fasilitas tidak ditemukan");
      return;
    }

    const booking = {
      fasilitas_id: selectedFacility.id,
      tanggal_pemesanan: date,
      waktu_mulai: startTime,
      waktu_selesai: endTime,
      jumlah_orang: people,
      total_harga: totalPrice,
    };

    setIsBookingLoading(true);

    try {
      const success = await createFacilityBooking(booking as FacilityBooking);

      // Ambil error terbaru langsung dari store setelah operasi selesai
      const currentError = useBookingStore.getState().error;

      if (success) {
        toast.success("Pemesanan fasilitas berhasil dibuat");
        router.push("/bookings");
      } else {
        toast.error(currentError || "Gagal membuat pemesanan");
      }
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    } finally {
      setIsBookingLoading(false);
    }
  };

  if (isLoading || !selectedFacility) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat detail fasilitas..." />
      </div>
    );
  }

  // Extract possible facility features from the description
  const facilityFeatures = selectedFacility.deskripsi
    ? selectedFacility.deskripsi
        .split(".")
        .filter((sentence) => sentence.trim().length > 0)
        .slice(0, 3)
        .map((sentence) => ({
          title: sentence.trim(),
        }))
    : [];

  // Determine operating hours
  const operatingHours = {
    opening: selectedFacility.jam_buka || "08:00",
    closing: selectedFacility.jam_tutup || "20:00",
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button
            className="mr-3 text-gray-600 hover:text-gray-900"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Detail Fasilitas</h1>
        </div>

        <FadeIn>
          <ImageGallery images={selectedFacility.gambar_fasilitas || []} />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FadeIn delay={0.1}>
              <FacilityInfo facility={selectedFacility} />
            </FadeIn>

            {facilityFeatures.length > 0 && (
              <FadeIn delay={0.2}>
                <FacilityFeatures features={facilityFeatures} />
              </FadeIn>
            )}
          </div>

          <div>
            {selectedFacility.tersedia && (
              <FadeIn delay={0.3}>
                <BookingForm
                  facilityPrice={selectedFacility.harga || 0}
                  operatingHours={operatingHours}
                  onSubmit={handleBookNow}
                  isLoading={isBookingLoading}
                />
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
