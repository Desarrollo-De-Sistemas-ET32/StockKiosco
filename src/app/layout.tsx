"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navBar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Rutas en las que NO se mostrará el NavBar
  const hideNavbar = ["/login", "/register"]; 
  const shouldHideNavbar = hideNavbar.includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {!shouldHideNavbar && (
          <div className="py-6">
            <NavBar />
          </div>
        )}
        {children}
      </body>
    </html>
  );
}