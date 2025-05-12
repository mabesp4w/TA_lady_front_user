/** @format */

// src/components/parallax/ParallaxBanner.tsx
import { Parallax } from "react-parallax";

interface ParallaxBannerProps {
  imageUrl: string;
  height?: string;
  children?: React.ReactNode;
}

export default function ParallaxBanner({
  imageUrl,
  height = "400px",
  children,
}: ParallaxBannerProps) {
  return (
    <Parallax
      bgImage={imageUrl}
      strength={400}
      bgImageStyle={{ objectFit: "cover" }}
      className="rounded-xl overflow-hidden"
    >
      <div style={{ height }} className="flex items-center justify-center">
        {children}
      </div>
    </Parallax>
  );
}
