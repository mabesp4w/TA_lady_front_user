/** @format */
"use client";
// src/components/navigation/MobileFooter.tsx
import Link from "next/link";
import { Calendar, Home, MapPin, ShoppingCart, User } from "lucide-react";
import { useProductStore } from "@/stores/productStore";

export default function MobileFooter() {
  const { cart } = useProductStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg py-2 px-4 z-50">
      <div className="grid grid-cols-5 gap-1">
        <Link href="/" className="flex flex-col items-center">
          <Home size={20} className="text-gray-600" />
          <span className="text-xs mt-1">Beranda</span>
        </Link>

        <Link href="/rooms" className="flex flex-col items-center">
          <Calendar size={20} className="text-gray-600" />
          <span className="text-xs mt-1">Kamar</span>
        </Link>

        <Link href="/location" className="flex flex-col items-center">
          <MapPin size={20} className="text-gray-600" />
          <span className="text-xs mt-1">Lokasi</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center relative">
          <ShoppingCart size={20} className="text-gray-600" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
          <span className="text-xs mt-1">Keranjang</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center">
          <User size={20} className="text-gray-600" />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </div>
  );
}
