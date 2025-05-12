/** @format */
"use client";
// src/components/navigation/MobileNavbar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Home,
  LogOut,
  ShoppingBag,
  Calendar,
  ChevronRight,
} from "lucide-react";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  // Deteksi scroll untuk mengubah tampilan navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu saat pathname berubah
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Menu item untuk navigasi
  const menuItems = [
    { href: "/", label: "Beranda", icon: <Home size={20} /> },
    { href: "/rooms", label: "Kamar", icon: <Calendar size={20} /> },
    {
      href: "/facilities",
      label: "Fasilitas",
      icon: <ShoppingBag size={20} />,
    },
    { href: "/shop", label: "Toko", icon: <ShoppingBag size={20} /> },
  ];

  // Menu item untuk user yang sudah login
  const userMenuItems = [
    { href: "/profile", label: "Profil Saya", icon: <User size={20} /> },
    { href: "/bookings", label: "Pesanan Saya", icon: <Calendar size={20} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-gradient-to-b from-black/60 to-transparent py-3"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="flex items-center">
          {/* Ganti dengan logo resort sesuai kebutuhan */}
          <div className="relative w-8 h-8 mr-2">
            <Image
              src="/images/logo.png"
              alt="Resort Terminal 12"
              fill
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z'%3E%3C/path%3E%3Cpolyline points='9 22 9 12 15 12 15 22'%3E%3C/polyline%3E%3C/svg%3E";
              }}
            />
          </div>
          <span
            className={`font-bold text-lg ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            Terminal 12
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          className={`p-2 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-gray-100 hover:bg-gray-200"
              : "bg-white/20 backdrop-blur-md hover:bg-white/30"
          }`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X
              size={24}
              className={scrolled ? "text-gray-800" : "text-white"}
            />
          ) : (
            <Menu
              size={24}
              className={scrolled ? "text-gray-800" : "text-white"}
            />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ul className="divide-y divide-gray-100">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between py-4 px-6 hover:bg-gray-50 ${
                        pathname === item.href
                          ? "text-primary font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={
                            pathname === item.href
                              ? "text-primary"
                              : "text-gray-500"
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="ml-3">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-2 pb-4 px-4">
                {user ? (
                  <>
                    <div className="py-3 px-2 mb-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                          {user.nama ? (
                            user.nama.charAt(0).toUpperCase()
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">
                            {user.nama || "Pengguna"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-1">
                      {userMenuItems.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + 0.05 * index }}
                        >
                          <Link
                            href={item.href}
                            className={`flex items-center py-3 px-2 rounded-lg hover:bg-gray-50 ${
                              pathname === item.href
                                ? "text-primary font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            <span
                              className={
                                pathname === item.href
                                  ? "text-primary"
                                  : "text-gray-500"
                              }
                            >
                              {item.icon}
                            </span>
                            <span className="ml-3">{item.label}</span>
                          </Link>
                        </motion.li>
                      ))}

                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          onClick={logout}
                          className="flex items-center py-3 px-2 text-red-500 hover:bg-red-50 rounded-lg w-full text-left mt-2"
                        >
                          <LogOut size={20} className="mr-3" />
                          <span>Keluar</span>
                        </button>
                      </motion.li>
                    </ul>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-2"
                  >
                    <Link
                      href="/login"
                      className="flex items-center justify-center bg-primary text-white py-3 px-4 rounded-lg font-medium shadow-md hover:bg-primary-dark transition-colors"
                    >
                      <User size={18} className="mr-2" />
                      <span>Masuk / Daftar</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
