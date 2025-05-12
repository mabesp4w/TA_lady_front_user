/** @format */
"use client";
// src/components/navigation/MobileFooter.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, MapPin, ShoppingCart, User } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { motion } from "framer-motion";
import React from "react";

export default function MobileFooter() {
  const { cart } = useProductStore();
  const pathname = usePathname();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { href: "/", label: "Beranda", icon: <Home size={20} /> },
    { href: "/rooms", label: "Kamar", icon: <Calendar size={20} /> },
    { href: "/location", label: "Lokasi", icon: <MapPin size={20} /> },
    {
      href: "/cart",
      label: "Keranjang",
      icon: <ShoppingCart size={20} />,
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
    { href: "/profile", label: "Profil", icon: <User size={20} /> },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg py-2 px-2 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center pt-1 pb-1 rounded-lg transition-colors ${
              pathname === item.href
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {pathname === item.href && (
              <motion.div
                layoutId="footer-active-pill"
                className="absolute top-0 w-1 h-1 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <div className="relative">
              {React.cloneElement(item.icon, {
                className:
                  pathname === item.href ? "text-primary" : "text-gray-500",
              })}

              {item.badge && (
                <motion.span
                  className="absolute -top-1 -right-2 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  {item.badge > 9 ? "9+" : item.badge}
                </motion.span>
              )}
            </div>

            <span
              className={`text-xs mt-1 ${
                pathname === item.href ? "font-medium" : ""
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
