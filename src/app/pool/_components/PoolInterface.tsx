"use client";

import { useState } from "react";
import { SwapNavbar } from "@/components/swap/SwapNavbar";
import { CreatePoolForm } from "./CreatePool";
import { PoolList } from "./PoolList";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, History } from "lucide-react";

export function PoolInterface() {
  const [activeTab, setActiveTab] = useState<"create" | "existing">("create");

  return (
    <div className="min-h-screen">
      <SwapNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Pool Panel */}
          <div className="lg:col-span-1">
            <CreatePoolForm />
          </div>

          {/* Pools List Panel */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex items-center space-x-1 mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10 w-fit">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "create"
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Popular Pools</span>
              </button>

              <button
                onClick={() => setActiveTab("existing")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "existing"
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <History className="w-4 h-4" />
                <span>My Positions</span>
              </button>
            </div>

            {/* Pool Content */}
            <AnimatePresence mode="wait">
              <PoolList key={activeTab} activeTab={activeTab} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}