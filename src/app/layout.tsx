import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google"; // Consolidated imports
import "./globals.css";
import { Toaster } from "react-hot-toast";
import FirebaseProvider from '../components/FirebaseProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

// Next.js uses this metadata object to automatically populate your <head>
export const metadata: Metadata = {
  title: "Unique Stores",
  description: "High-quality products for your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 1. Applied the font variables to the body.
        2. Added 'font-sans' (or your preferred default) to use Open Sans globally.
      */}
      <body className={`${openSans.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Toaster position="top-left" />
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}