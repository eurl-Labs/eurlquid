import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { WalletProviders } from "@/providers/WalletProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eurlquid - Smart DEX Aggregator with AI Intelligence",
  description:
    "Stop gambling with stale data. Get real-time liquidity insights, MEV protection, and optimal execution timing across all major DEXs with advanced AI predictions.",
  icons: {
    icon: `/favicon.ico?v=${Date.now()}`,
    shortcut: `/favicon.ico?v=${Date.now()}`,
    apple: `/favicon.ico?v=${Date.now()}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProviders>
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}
