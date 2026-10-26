import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google"; // Consolidated imports
import "./globals.css";
import { Toaster } from "react-hot-toast";
import FirebaseProvider from '../components/FirebaseProvider';
import ShopProvider from '../components/ShopProvider';

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
  title: { default: "Unigue Stores", template: "%s | Unigue Stores" },
  description: "Footwear and luxury sneakers, delivered across Nigeria.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* 1. Applied the font variables to the body.
        2. Added 'font-sans' (or your preferred default) to use Open Sans globally.
      */}
      <body className={`${openSans.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* Sets data-theme before first paint so there's no flash of the
            wrong theme. Must run synchronously, before React hydrates —
            see src/components/ThemeToggle.tsx for the toggle itself. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('unigue-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'uniguedark':'uniguelight';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <Toaster position="top-left" />
        <FirebaseProvider>
          <ShopProvider>
            {children}
            {modal}
          </ShopProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}