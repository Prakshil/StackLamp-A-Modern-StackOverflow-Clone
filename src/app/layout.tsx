import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore: CSS side-effect import has no type declarations
import "./globals.css";
import ToastProvider from "@/components/providers/toast-provider";
import AuthProvider from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackLamp - Ask, Answer, Share Knowledge",
  description: "A modern Q&A platform for developers. Ask questions, share knowledge, and learn together.",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider />
          {/* Gradient grid background */}
          <div className="min-h-screen w-full bg-white relative">
            <div 
              className="fixed inset-0 z-0" 
              style={{
                backgroundImage: `linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px), 
                                  linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px), 
                                  radial-gradient(circle 500px at 20% 100%, rgba(139,92,246,0.3), transparent), 
                                  radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.3), transparent)`,
                backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%'
              }}
            />
            <div className="relative z-10">
              <div id="app-header" />
              <main>{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
