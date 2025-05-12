/** @format */

// src/components/home/FacilitySection.tsx
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useFacilityStore } from "@/stores/facilityStore";
import { BASE_URL } from "@/services/baseURL";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function FacilitySection() {
  const { facilities, fetchFacilities } = useFacilityStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section ref={ref}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Fasilitas Resort</h2>
        <Link
          href="/facilities"
          className="text-primary flex items-center hover:underline font-medium"
        >
          Lihat Semua <ChevronRight size={16} />
        </Link>
      </div>

      <motion.div
        className="overflow-x-auto pb-4 -mx-4 px-4"
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <div className="flex space-x-4">
          {facilities.slice(0, 4).map((facility) => {
            const facilityImage =
              facility?.gambar_fasilitas?.find((img) => img.gambar_utama) ||
              facility?.gambar_fasilitas?.[0];
            return (
              <motion.div
                key={facility.id}
                variants={item}
                className="min-w-[280px] card group"
              >
                <Link href={`/facilities/${facility.id}`}>
                  {facilityImage ? (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={`${BASE_URL}/${facilityImage.jalur_gambar}`}
                        alt={facility.nm_fasilitas}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1">
                      {facility.nm_fasilitas}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {facility.jam_buka} - {facility.jam_tutup}
                      </span>
                    </div>
                    <p className="text-primary font-bold text-lg">
                      Rp{facility.harga.toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
