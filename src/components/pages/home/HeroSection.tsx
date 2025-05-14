/** @format */

// src/components/home/HeroSection.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues with Swiper
  useEffect(() => {
    setMounted(true);
  }, []);

  // Array gambar untuk swiper
  const heroImages = [
    {
      src: "/images/terminal12/1.jpg",
      alt: "Resort Terminal 12 Holtekamp View 1",
    },
    {
      src: "/images/terminal12/2.jpg",
      alt: "Resort Terminal 12 Holtekamp View 2",
    },
    {
      src: "/images/terminal12/3.jpg",
      alt: "Resort Terminal 12 Holtekamp View 3",
    },
    {
      src: "/images/terminal12/4.jpg",
      alt: "Resort Terminal 12 Holtekamp View 4",
    },
  ];

  return (
    <div className="relative h-80 sm:h-96 md:h-[500px] rounded-xl overflow-hidden">
      {mounted && (
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={false}
          loop={true}
          className="h-full w-full"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index} className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col justify-center items-center text-white p-6">
                {/* Content stays consistent across slides */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Content overlay - placed outside to maintain consistent position */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white p-6 pointer-events-none">
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto"
          >
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
