/** @format */
// src/components/rooms/ImageGallery.tsx
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BASE_URL } from "@/services/baseURL";

interface GalleryImage {
  id: number;
  jalur_gambar: string;
  gambar_utama?: boolean;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="relative h-64">
        <Image
          src={`${BASE_URL}/${images[currentImageIndex].jalur_gambar}`}
          alt={`Room image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center mt-2 space-x-2 py-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === currentImageIndex ? "bg-primary" : "bg-gray-300"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
