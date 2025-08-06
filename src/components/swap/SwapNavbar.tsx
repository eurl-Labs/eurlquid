"use client";

import {
  ArrowLeft,
  Settings,
  HelpCircle,
  Clock,
  Menu,
  X,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

export function SwapNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back button and Logo */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo/eurlquidLogo.png"
                alt="eurlquid logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white">eurlquid</span>
              <span className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full">
                {pathname === "/swap"
                  ? "Swap"
                  : pathname === "/history"
                  ? "History"
                  : pathname === "/liquidity"
                  ? "Liquidity Explorer"
                  : "App"}
              </span>
            </div>
          </div>

          {/* Center - Navigation Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/swap"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/swap"
                  ? "bg-blue-600 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Swap
            </Link>
            <Link
              href="/history"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                pathname === "/history"
                  ? "bg-blue-600 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History</span>
            </Link>
            <Link
              href="/liquidity"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                pathname === "/liquidity"
                  ? "bg-blue-600 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Liquidity Explorer</span>
            </Link>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Connect Wallet Button */}

            <ConnectWalletButton />

            <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/swap"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/swap"
                    ? "bg-blue-600 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                Swap
              </Link>
              <Link
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  pathname === "/history"
                    ? "bg-blue-600 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>History</span>
              </Link>
              <Link
                href="/liquidity"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  pathname === "/liquidity"
                    ? "bg-blue-600 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Liquidity Explorer</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
