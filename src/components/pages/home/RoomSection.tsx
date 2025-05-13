/** @format */

// src/components/home/RoomSection.tsx
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRoomStore } from "@/stores/roomStore";
import showRupiah from "@/services/rupiah";
import { BASE_URL } from "@/services/baseURL";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function RoomSection() {
  const { rooms, fetchRooms } = useRoomStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

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
        <h2 className="section-title">Kamar Tersedia</h2>
        <Link
          href="/rooms"
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
          {rooms?.slice(0, 4).map((room) => {
            const roomImage =
              room?.gambar_kamar?.find((img) => img.gambar_utama) ||
              room?.gambar_kamar?.[0];

            return (
              <motion.div
                key={room.id}
                variants={item}
                className="min-w-[280px] card group"
              >
                <Link href={`/rooms/${room.id}`}>
                  {roomImage ? (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={`${BASE_URL}/${roomImage.jalur_gambar}`}
                        alt={room.no_kamar}
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
                      {room.jenis_kamar?.nm_jenis_kamar}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Kamar {room.no_kamar} - {room.lantai}
                    </p>
                    <p className="text-primary font-bold text-lg">
                      {showRupiah(room.jenis_kamar?.harga_per_malam || 0)}
                      <span className="text-sm font-normal text-gray-600">
                        /malam
                      </span>
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
