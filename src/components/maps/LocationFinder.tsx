/** @format */

// src/components/maps/LocationFinder.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN, RESORT_COORDINATES } from "@/utils/mapboxConfig";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface LocationFinderProps {
  onLocationSelect?: (coordinates: {
    lng: number;
    lat: number;
    address: string;
  }) => void;
  height?: string;
}

export default function LocationFinder({
  onLocationSelect,
  height = "400px",
}: LocationFinderProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number;
    lat: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [RESORT_COORDINATES.lng, RESORT_COORDINATES.lat],
      zoom: 12,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Initialize marker
    marker.current = new mapboxgl.Marker({ draggable: true, color: "#2563eb" })
      .setLngLat([RESORT_COORDINATES.lng, RESORT_COORDINATES.lat])
      .addTo(map.current);

    // Add geocoder (search box)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken as string,
      mapboxgl: mapboxgl as any,
      marker: false,
      placeholder: "Cari lokasi...",
      proximity: {
        longitude: RESORT_COORDINATES.lng,
        latitude: RESORT_COORDINATES.lat,
      },
    });

    map.current.addControl(geocoder);

    // Handle geocoder result
    geocoder.on("result", (e) => {
      const coordinates = e.result.center;
      marker.current?.setLngLat(coordinates);

      const newLocation = {
        lng: coordinates[0],
        lat: coordinates[1],
        address: e.result.place_name || "",
      };

      setSelectedLocation(newLocation);
      onLocationSelect?.(newLocation);
    });

    // Handle marker drag end
    marker.current.on("dragend", async () => {
      const lngLat = marker.current?.getLngLat();

      if (lngLat) {
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name || "";

          const newLocation = {
            lng: lngLat.lng,
            lat: lngLat.lat,
            address,
          };

          setSelectedLocation(newLocation);
          onLocationSelect?.(newLocation);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onLocationSelect]);

  return (
    <div className="space-y-4">
      <div
        ref={mapContainer}
        className="rounded-lg overflow-hidden shadow-md w-full"
        style={{ height }}
      />

      {selectedLocation && (
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-800 mb-1">Lokasi Terpilih:</h3>
          <p className="text-sm text-gray-600">{selectedLocation.address}</p>
          <div className="flex text-xs text-gray-500 mt-1">
            <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
            <span className="mx-2">|</span>
            <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
