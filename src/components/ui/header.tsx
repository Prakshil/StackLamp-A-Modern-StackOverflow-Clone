"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { useAuthStore } from "@/store/auth";
import { IconLogout, IconUser } from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    await logout();
    toast.success("Logged out successfully!", { id: toastId });
    router.push("/");
  };

  return (
    <header className="border-b bg-white/40 dark:bg-black/40 sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="text-lg md:text-xl font-bold hover:text-indigo-600 transition-colors">
          StackLamp
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-600">
              <IconUser className="w-4 h-4" />
              <span className="max-w-[150px] truncate">{user.name}</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-sm md:text-base px-3 md:px-4"
            >
              <IconLogout className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 md:space-x-2">
            <Link href="/login">
              <Button variant="ghost" className="text-sm md:text-base px-3 md:px-4">Log in</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" className="text-sm md:text-base px-3 md:px-4">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
