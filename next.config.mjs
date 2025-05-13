/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  env: {
    // Menambahkan konfigurasi Midtrans ke environment Next.js
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  headers: async () => {
    return [
      {
        // Mengizinkan Midtrans untuk memanggil endpoint dari domain kita
        source: "/api/payments/callback",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://api.midtrans.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  // Jika Anda perlu menambahkan redirect untuk Midtrans callback URLs
  async redirects() {
    return [
      {
        source: "/payment/callback",
        destination: "/api/payments/callback",
        permanent: true,
      },
    ];
  },
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
