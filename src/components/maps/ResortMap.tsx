/** @format */

// src/components/maps/ResortMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MAPBOX_ACCESS_TOKEN,
  RESORT_COORDINATES,
  DEFAULT_ZOOM,
} from "@/utils/mapboxConfig";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface ResortMapProps {
  width?: string;
  height?: string;
  interactive?: boolean;
  showMarker?: boolean;
  zoom?: number;
  className?: string;
}

export default function ResortMap({
  width = "100%",
  height = "300px",
  interactive = true,
  showMarker = true,
  zoom = DEFAULT_ZOOM,
  className = "",
}: ResortMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [RESORT_COORDINATES.lng, RESORT_COORDINATES.lat],
      zoom: zoom,
      interactive: interactive,
    });

    map.current.on("load", () => {
      setMapLoaded(true);

      if (showMarker && map.current) {
        marker.current = new mapboxgl.Marker({ color: "#2563eb" })
          .setLngLat([RESORT_COORDINATES.lng, RESORT_COORDINATES.lat])
          .addTo(map.current);
      }

      // Add navigation controls if interactive
      if (interactive && map.current) {
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.current.addControl(new mapboxgl.FullscreenControl());
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [interactive, showMarker, zoom]);

  return (
    <div
      ref={mapContainer}
      style={{ width, height }}
      className={`rounded-lg overflow-hidden shadow-md ${className}`}
    />
  );
}
