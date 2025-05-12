/** @format */

// src/components/home/HeroSection.tsx
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="relative h-80 sm:h-96 md:h-[500px] rounded-xl overflow-hidden">
      <Image
        src="/images/resort-hero.jpg"
        alt="Resort Terminal 12 Holtekamp"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col justify-center items-center text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center leading-tight">
            Resort Terminal 12 Holtekamp
          </h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl mx-auto">
            Nikmati Pengalaman Menginap Yang Tak Terlupakan di Tepi Pantai Papua
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/rooms"
              className="btn btn-primary text-lg px-8 py-3 shadow-lg"
            >
              Pesan Kamar Sekarang
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
