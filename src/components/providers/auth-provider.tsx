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
      verifySession().catch((error) => {
        console.error("Session verification failed:", error);
        // Continue anyway - user will need to login
      });
    }
  }, [hydrated, verifySession]);

  return <>{children}</>;
}
