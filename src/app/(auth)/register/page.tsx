"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
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

export default function RegisterPage() {
    const router = useRouter();
    const { createAccount, login, user, hydrated } = useAuthStore();
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
        const firstname = formData.get("firstname")?.toString().trim() || "";
        const lastname = formData.get("lastname")?.toString().trim() || "";
        const email = formData.get("email")?.toString().trim() || "";
        const password = formData.get("password")?.toString() || "";

        if (!firstname || !email || !password) {
            toast.error("First name, email and password are required");
            return;
        }

        const name = `${firstname}${lastname ? ` ${lastname}` : ""}`;
        setIsLoading(true);
        const toastId = toast.loading("Creating your account...");

        const res = await createAccount(name, email, password);

        if (!res.success) {
            toast.error(res.error?.message || "Something went wrong", { id: toastId });
            setIsLoading(false);
        } else {
            const loginRes = await login(email, password);
            if (!loginRes.success) {
                toast.error(loginRes.error?.message || "Something went wrong during login", { id: toastId });
                setIsLoading(false);
            } else {
                toast.success("Account created successfully!", { id: toastId });
                router.push("/");
            }
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
                        <h2 className="text-xl md:text-2xl font-bold mb-2">Join StackLamp</h2>
                        <p className="text-sm text-neutral-600 mb-6">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-600 hover:underline">
                                Log in
                            </Link>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstname">First name</Label>
                                    <Input
                                        id="firstname"
                                        name="firstname"
                                        placeholder="Tyler"
                                        className="mt-2"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastname">Last name</Label>
                                    <Input
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Durden"
                                        className="mt-2"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

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
                                {isLoading ? "Creating account..." : "Sign up"}
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}