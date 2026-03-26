import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Manrope({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "EIGHT25 Website Audit Tool",
  description: "AI-powered single-page website audit with grounded metrics, traceable prompts, and premium reporting."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontDisplay.variable}`}>
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
