/** @format */
// src/components/rooms/LocationSection.tsx
import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import ResortMap from "@/components/maps/ResortMap";

export default function LocationSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Lokasi Resort</h2>

      <ResortMap height="200px" />

      <div className="mt-4">
        <div className="flex items-center">
          <MapPin size={18} className="text-gray-500 mr-2" />
          <span className="text-gray-700">
            Jl. Holtekamp, Distrik Muara Tami, Kota Jayapura, Papua
          </span>
        </div>

        <Link
          href="/location"
          className="flex items-center justify-center mt-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
        >
          <Navigation size={18} className="mr-2" />
          Lihat Petunjuk Arah
        </Link>
      </div>
    </div>
  );
}
