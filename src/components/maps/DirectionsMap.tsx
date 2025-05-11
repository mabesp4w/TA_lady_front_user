/** @format */

// src/components/maps/DirectionsMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN, RESORT_COORDINATES } from "@/utils/mapboxConfig";
import { MapPin, Navigation } from "lucide-react";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export default function DirectionsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [RESORT_COORDINATES.lng, RESORT_COORDINATES.lat],
      zoom: 13,
    });

    // Add resort marker
    new mapboxgl.Marker({ color: "#2563eb" })
      .setLngLat([RESORT_COORDINATES.lng, RESORT_COORDINATES.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          "<strong>Resort Terminal 12 Holtekamp</strong>"
        )
      )
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation({ lng: longitude, lat: latitude });

          if (map.current) {
            // Add user location marker
            new mapboxgl.Marker({ color: "#ef4444" })
              .setLngLat([longitude, latitude])
              .setPopup(
                new mapboxgl.Popup().setHTML("<strong>Lokasi Anda</strong>")
              )
              .addTo(map.current);

            // Adjust map to show both points
            const bounds = new mapboxgl.LngLatBounds()
              .extend([RESORT_COORDINATES.lng, RESORT_COORDINATES.lat])
              .extend([longitude, latitude]);

            map.current.fitBounds(bounds, { padding: 80 });

            // Draw route
            getRoute(
              [longitude, latitude],
              [RESORT_COORDINATES.lng, RESORT_COORDINATES.lat]
            );
          }

          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser Anda");
      setIsLoading(false);
    }
  };

  const getRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        // Get distance and duration
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.floor(route.duration / 60);

        setDistance(`${distanceKm} km`);
        setDuration(`${durationMin} menit`);

        // Add route to map
        if (map.current) {
          if (map.current.getSource("route")) {
            (map.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
              type: "Feature",
              properties: {},
              geometry: route.geometry,
            });
          } else {
            map.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            });

            map.current.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#2563eb",
                "line-width": 5,
                "line-opacity": 0.75,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error getting route:", error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="w-full py-3 flex items-center justify-center bg-primary text-white rounded-lg font-medium"
        onClick={getCurrentLocation}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Mencari lokasi Anda...
          </span>
        ) : (
          <>
            <Navigation size={18} className="mr-2" />
            Temukan Rute ke Resort
          </>
        )}
      </button>

      <div
        ref={mapContainer}
        className="rounded-lg overflow-hidden shadow-md w-full h-[400px]"
      />

      {distance && duration && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-800 mb-2">Informasi Rute:</h3>
          <div className="flex justify-between">
            <div className="flex items-center">
              <MapPin size={18} className="text-primary mr-2" />
              <span>Jarak: {distance}</span>
            </div>
            <div className="flex items-center">
              <Navigation size={18} className="text-primary mr-2" />
              <span>Waktu Tempuh: {duration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
