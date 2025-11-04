"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { verifySession, hydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated) {
      // Check for existing session (including OAuth)
      verifySession();
    }
  }, [hydrated, verifySession]);

  return <>{children}</>;
}
