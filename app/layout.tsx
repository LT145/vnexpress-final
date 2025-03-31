"use client"

import "./globals.css";
import Providers from "./components/providers/providers";
import { heebo } from "@/lib/font";
import Header from "@/components/Header";
import { usePathname } from 'next/navigation';
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-white min-h-screen">
          {!pathname.startsWith('/dashboard') && <Header/>}
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
