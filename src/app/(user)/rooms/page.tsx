/** @format */
// src/app/rooms/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRoomStore } from "@/stores/roomStore";
import SearchFilter from "@/components/pages/rooms/SearchFilter";
import RoomsList from "@/components/pages/rooms/RoomsList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/animation/FadeIn";
import Stagger from "@/components/animation/Stagger";

export default function RoomsPage() {
  const { rooms, roomTypes, fetchRooms, fetchRoomTypes, isLoading } =
    useRoomStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, [fetchRooms, fetchRoomTypes]);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.no_kamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.jenis_kamar?.nm_jenis_kamar
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType = selectedType
      ? room.jenis_kamar_id === selectedType
      : true;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Memuat kamar..." />
      </div>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader title="Daftar Kamar" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          roomTypes={roomTypes}
        />
      </FadeIn>

      <Stagger>
        <RoomsList rooms={filteredRooms} />
      </Stagger>
    </PageContainer>
  );
}
