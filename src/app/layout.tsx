import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexoloom Digital | Premium E-Commerce, Marketing & Design",
  description: "Nexoloom Digital crafts high-converting e-commerce websites, growth-oriented digital marketing strategies, and premium brand designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[#030307] text-slate-100`}>
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" toastOptions={{
                className: 'dark:bg-slate-800 dark:text-slate-100 bg-white text-slate-800 border dark:border-slate-700 border-slate-200 rounded-lg shadow-xl',
                duration: 4000,
              }} />
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
        {/* Load Cloudinary Upload Widget Globally */}
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
