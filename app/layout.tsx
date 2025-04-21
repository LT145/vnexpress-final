"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import HeaderWrapper from "./components/HeaderWrapper";
import { HeaderProvider } from "../context/HeaderContext";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <HeaderProvider>
        <html lang="en">
          <body className="bg-white min-h-screen ">
            <HeaderWrapper />
            {children}
            <Footer />
          </body>
        </html>
      </HeaderProvider>
    </SessionProvider>
  );
}
