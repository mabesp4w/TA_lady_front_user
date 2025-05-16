/** @format */

// src/components/home/AboutSection.tsx
import ResortMap from "@/components/maps/ResortMap";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Clock, PhoneCall } from "lucide-react";

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      className="bg-white p-8 rounded-xl shadow-md"
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-title mb-6">
        Tentang Resort Terminal 12 Holtekamp
      </h2>

      <div className="md:flex gap-8">
        <div className="md:w-1/2">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Resort Terminal 12 Holtekamp adalah tempat peristirahatan mewah yang
            terletak di lokasi strategis dengan pemandangan pantai yang
            menakjubkan. Dikelilingi oleh keindahan alam Papua, resort kami
            menawarkan berbagai fasilitas premium dan pelayanan terbaik untuk
            membuat liburan Anda menjadi pengalaman yang tak terlupakan.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <MapPin size={18} className="text-primary mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                Jl. Holtekamp, Distrik Muara Tami, Kota Jayapura, Papua
              </span>
            </div>

            <div className="flex items-center">
              <Clock size={18} className="text-primary mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                Check-in: 14:00 • Check-out: 12:00
              </span>
            </div>

            <div className="flex items-center">
              <PhoneCall
                size={18}
                className="text-primary mr-3 flex-shrink-0"
              />
              <span className="text-gray-700">+62 123-4567-8910</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <ResortMap height="300px" interactive={true} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
