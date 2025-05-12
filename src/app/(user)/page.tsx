/** @format */

// src/app/page.tsx
"use client";

import HeroSection from "@/components/pages/home/HeroSection";
import RoomSection from "@/components/pages/home/RoomSection";
import FacilitySection from "@/components/pages/home/FacilitySection";
import AboutSection from "@/components/pages/home/AboutSection";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="space-y-12 mb-16">
      <HeroSection />

      <div data-aos="fade-up">
        <RoomSection />
      </div>

      <div data-aos="fade-up">
        <FacilitySection />
      </div>

      <div data-aos="fade-up">
        <AboutSection />
      </div>
    </div>
  );
}
