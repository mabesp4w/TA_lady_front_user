/** @format */
// src/components/facilities/FacilitiesList.tsx
import { FasilitasType } from "@/types";
import FacilityCard from "./FacilityCard";
import EmptyState from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import Stagger from "@/components/animation/Stagger";
import StaggerItem from "@/components/animation/StaggerItem";

interface FacilitiesListProps {
  facilities: FasilitasType[];
}

export default function FacilitiesList({ facilities }: FacilitiesListProps) {
  if (facilities.length === 0) {
    return (
      <EmptyState
        icon={<Search size={48} />}
        title="Tidak ada fasilitas yang ditemukan"
        description="Tidak ada fasilitas yang sesuai dengan kriteria pencarian Anda."
      />
    );
  }

  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {facilities.map((facility) => (
        <StaggerItem key={facility.id}>
          <FacilityCard facility={facility} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
