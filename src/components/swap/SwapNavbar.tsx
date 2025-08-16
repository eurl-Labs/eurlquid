"use client";

import {
  ArrowLeft,
  HelpCircle,
  Clock,
  Menu,
  X,
  Search,
  Droplets, // For Pool - represents liquidity pools
  TrendingUp, // Alternative for Pool
  ArrowLeftRight,
  Compass,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { NavigationLink } from "@/components/ui/NavigationLink";

export function SwapNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (pathname) {
      case "/swap":
        return "Swap";
      case "/bridge":
        return "Bridge";
      case "/pool":
      case "/liquidity":
      case "/faucets":
        return "Explore";
      case "/history":
        return "History";
      default:
        return "App";
    }
  };

  const isExplorePage = ["/pool", "/liquidity", "/faucets"].includes(pathname);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Page Title */}
          <div className="flex items-center space-x-4">
            <NavigationLink
              href="/"
              className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors"
            >
              <Image
                src="/images/logo/eurlquidLogo.png"
                alt="eurlquid logo"
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-white">eurlquid</span>
            </NavigationLink>
            
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            
            <span className="hidden sm:block text-sm text-white/60 font-medium">
              {getPageTitle()}
            </span>
          </div>

          {/* Center - Navigation Menu (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            <NavigationLink
              href="/swap"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                pathname === "/swap"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Swap</span>
            </NavigationLink>

            {/* <NavigationLink
              href="/bridge"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                pathname === "/bridge"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>Bridge</span>
            </NavigationLink> */}

            {/* Explore dropdown/menu */}
            <div className="relative group">
              <NavigationLink
                href="/pool"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isExplorePage
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </NavigationLink>

              {/* Dropdown menu for Explore */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-white backdrop-blur-lg border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <NavigationLink
                    href="/pool"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === "/pool"
                        ? "bg-white/20 text-black"
                        : "text-black hover:text-white hover:bg-black"
                    }`}
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Liquidity Pools</span>
                  </NavigationLink>
                  <NavigationLink
                    href="/liquidity"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === "/liquidity"
                        ? "bg-white/20 text-black"
                        : "text-black hover:text-white hover:bg-black"
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Explorer</span>
                  </NavigationLink>
                  <NavigationLink
                    href="/faucets"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === "/faucets"
                        ? "bg-white/20 text-black"
                        : "text-black hover:text-white hover:bg-black"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Faucets</span>
                  </NavigationLink>
                </div>
              </div>
            </div>

            <NavigationLink
              href="/history"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                pathname === "/history"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History</span>
            </NavigationLink>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Connect Wallet */}
            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>

      

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
          <div className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Wallet Connection */}
              <div className="mb-4">
                <ConnectWalletButton />
              </div>

              {/* Navigation Links */}
              <NavigationLink
                href="/swap"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/swap"
                    ? "bg-white text-black"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <ArrowLeftRight className="w-5 h-5" />
                <span>Swap Tokens</span>
              </NavigationLink>

              <NavigationLink
                href="/bridge"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/bridge"
                    ? "bg-white text-black"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>Bridge Assets</span>
              </NavigationLink>

              {/* Explore Section */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Explore
                </div>
                <NavigationLink
                  href="/pool"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === "/pool"
                      ? "bg-white text-black"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Droplets className="w-5 h-5" />
                  <span>Liquidity Pools</span>
                </NavigationLink>

                <NavigationLink
                  href="/liquidity"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === "/liquidity"
                      ? "bg-white text-black"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span>Liquidity Explorer</span>
                </NavigationLink>

                <NavigationLink
                  href="/faucets"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === "/faucets"
                      ? "bg-white text-black"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Testnet Faucets</span>
                </NavigationLink>
              </div>

              <NavigationLink
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/history"
                    ? "bg-white text-black"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Transaction History</span>
              </NavigationLink>


            </div>
          </div>
        )}
      </div>
    </nav>
  );
}