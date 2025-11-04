"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Login() {
    const router = useRouter();
    const { login, user, hydrated } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);

    // Redirect if already logged in (wait for hydration)
    React.useEffect(() => {
        if (hydrated && user) {
            router.push("/");
        }
    }, [user, hydrated, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            toast.error("Please fill out all fields");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Logging in...");

        const loginResponse = await login(email.toString(), password.toString());
        if (loginResponse.error) {
            toast.error(loginResponse.error!.message, { id: toastId });
            setIsLoading(false);
        } else {
            toast.success("Logged in successfully!", { id: toastId });
            router.push("/");
        }
    };

    return (
        <>
            <Header />
            <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
                <motion.div
                    className="w-full max-w-md"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <Card>
                        <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome back to StackLamp</h2>
                        <p className="text-sm text-neutral-600 mb-6">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-indigo-600 hover:underline">
                                Sign up
                            </Link>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="mt-2"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="mt-2"
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Log in"}
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}

