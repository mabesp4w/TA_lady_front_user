/** @format */

// src/components/gallery/ImageGallery.tsx
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";

interface ImageGalleryProps {
  images: {
    id: number;
    jalur_gambar: string;
    gambar_utama?: boolean;
  }[];
  baseUrl: string;
  name: string;
}

export default function ImageGallery({
  images,
  baseUrl,
  name,
}: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Tidak ada gambar tersedia</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Zoom]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        zoom={true}
        className="h-[400px] rounded-lg overflow-hidden"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id} className="relative">
            <div className="swiper-zoom-container">
              <Image
                src={`${baseUrl}/${image.jalur_gambar}`}
                alt={`${name} - Gambar ${image.id}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper as any}
        spaceBetween={10}
        slidesPerView={4}
        modules={[Thumbs]}
        className="h-20"
      >
        {images.map((image) => (
          <SwiperSlide
            key={`thumb-${image.id}`}
            className="relative cursor-pointer rounded-md overflow-hidden"
          >
            <Image
              src={`${baseUrl}/${image.jalur_gambar}`}
              alt={`Thumbnail ${image.id}`}
              fill
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
