/** @format */
"use client";
// src/components/navigation/MobileNavbar.tsx
import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import {
  Menu,
  X,
  User,
  Home,
  LogOut,
  ShoppingBag,
  Calendar,
} from "lucide-react";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary">
          Resort Terminal 12
        </Link>

        <button onClick={toggleMenu} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <nav className="bg-white py-2 px-4 shadow-lg animate-fadeIn">
          <ul className="divide-y divide-gray-100">
            <li>
              <Link
                href="/"
                className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                <Home size={20} className="mr-3" />
                <span>Beranda</span>
              </Link>
            </li>
            <li>
              <Link
                href="/rooms"
                className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                <Calendar size={20} className="mr-3" />
                <span>Kamar</span>
              </Link>
            </li>
            <li>
              <Link
                href="/facilities"
                className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                <ShoppingBag size={20} className="mr-3" />
                <span>Fasilitas</span>
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                onClick={toggleMenu}
              >
                <ShoppingBag size={20} className="mr-3" />
                <span>Toko</span>
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    <User size={20} className="mr-3" />
                    <span>Profil Saya</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bookings"
                    className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    <Calendar size={20} className="mr-3" />
                    <span>Pesanan Saya</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="flex items-center py-3 px-2 text-red-500 hover:bg-gray-50 rounded-md w-full text-left"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span>Keluar</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-md"
                  onClick={toggleMenu}
                >
                  <User size={20} className="mr-3" />
                  <span>Masuk / Daftar</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
