/** @format */

// src/app/location/page.tsx
"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import ResortMap from "@/components/maps/ResortMap";
import DirectionsMap from "@/components/maps/DirectionsMap";

export default function LocationPage() {
  const [activeTab, setActiveTab] = useState<"map" | "directions">("map");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lokasi Resort</h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "map"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("map")}
          >
            <MapPin size={16} className="inline mr-1" />
            Peta Lokasi
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "directions"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("directions")}
          >
            <Navigation size={16} className="inline mr-1" />
            Petunjuk Arah
          </button>
        </div>

        {activeTab === "map" ? (
          <div className="space-y-4">
            <ResortMap height="350px" />

            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">
                Resort Terminal 12 Holtekamp
              </h2>
              <p className="text-gray-600 mb-3">
                Jl. Holtekamp, Distrik Muara Tami, Kota Jayapura, Papua
              </p>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <MapPin size={18} className="text-primary mr-2" />
                  <span>Terletak strategis di pesisir Jayapura</span>
                </div>
                <div className="flex items-center">
                  <Navigation size={18} className="text-primary mr-2" />
                  <span>15 menit dari pusat kota</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DirectionsMap />
        )}
      </div>
    </div>
  );
}
