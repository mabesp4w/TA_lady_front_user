/** @format */

// src/app/layout.tsx
import { Toaster } from "react-hot-toast";
import "./globals.css";
import MobileNavbar from "@/components/navigation/MobileNavbar";
import MobileFooter from "@/components/navigation/MobileFooter";
import DeviceTheme from "@/utils/DeviceTheme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <DeviceTheme />
      <body className="min-h-screen bg-gray-50 font-sofia">
        <Toaster position="top-center" />
        <MobileNavbar />
        <main className="container mx-auto px-4 pb-20 pt-16">{children}</main>
        <MobileFooter />
      </body>
    </html>
  );
}
