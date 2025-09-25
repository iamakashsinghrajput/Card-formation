// app/layout.tsx
import type { Metadata } from "next";
import { Edu_NSW_ACT_Foundation } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

// Configure the font
const eduFont = Edu_NSW_ACT_Foundation({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-edu', // CSS variable for the font
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BSF Dinner Invitation",
  description: "Invitation card created with Next.js and Tailwind CSS",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${eduFont.variable} font-sans`}>{children}<Analytics /></body>
    </html>
  );
}