"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const PoolInterface = dynamic(
  () =>
    import("./_components/CreatePool/PoolInterface").then((mod) => ({
      default: mod.PoolInterface,
    })),
  {
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-sm">Loading Pool...</div>
      </div>
    ),
  }
);

export default function PoolPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white/60 text-sm animate-pulse">
            Loading Pool Interface...
          </div>
        </div>
      }
    >
      <PoolInterface />
    </Suspense>
  );
}
