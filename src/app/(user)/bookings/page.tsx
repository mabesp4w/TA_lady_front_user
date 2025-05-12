/** @format */
// src/app/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import BookingTabs from "@/components/pages/bookings/BookingTabs";
import BookingsList from "@/components/pages/bookings/BookingsList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/animation/FadeIn";
import Stagger from "@/components/animation/Stagger";
import withAuth from "@/components/hoc/withAuth";

function BookingsPage() {
  const {
    roomBookings,
    facilityBookings,
    fetchRoomBookings,
    fetchFacilityBookings,
    isLoading,
  } = useBookingStore();
  const [activeTab, setActiveTab] = useState("rooms");

  useEffect(() => {
    fetchRoomBookings();
    fetchFacilityBookings();
  }, [fetchRoomBookings, fetchFacilityBookings]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat pesanan..." />
      </div>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader title="Pesanan Saya" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <BookingTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </FadeIn>

      <Stagger>
        <BookingsList
          type={activeTab as "rooms" | "facilities"}
          bookings={activeTab === "rooms" ? roomBookings : facilityBookings}
        />
      </Stagger>
    </PageContainer>
  );
}

export default withAuth(BookingsPage);
