import type { Metadata } from "next";
import { Manrope, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Blue Lark",
  description: "Modern fax platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${manrope.variable} ${interTight.variable} ${jetbrainsMono.variable} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
