/** @format */
// src/components/hoc/withAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const { user, checkAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuthentication = async () => {
        setIsLoading(true);
        const isLoggedIn = await checkAuth();
        if (!isLoggedIn) {
          router.push("/login");
        }
        setIsLoading(false);
      };

      checkAuthentication();
    }, [checkAuth, router]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner text="Memeriksa autentikasi..." />
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}
