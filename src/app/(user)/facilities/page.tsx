/** @format */
// src/app/facilities/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useFacilityStore } from "@/stores/facilityStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SearchFilter from "@/components/pages/facilities/SearchFilter";
import FacilitiesList from "@/components/pages/facilities/FacilitiesList";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/animation/FadeIn";

export default function FacilitiesPage() {
  const { facilities, fetchFacilities, isLoading } = useFacilityStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const filteredFacilities = facilities.filter((facility) => {
    return facility.nm_fasilitas
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat fasilitas..." />
      </div>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader title="Fasilitas Resort" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilter={false}
        />
      </FadeIn>

      <FacilitiesList facilities={filteredFacilities} />
    </PageContainer>
  );
}
