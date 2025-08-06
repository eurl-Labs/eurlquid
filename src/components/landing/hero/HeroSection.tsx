"use client";
import { SplitText } from "../split-text";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center z-10 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
          <SplitText
            text={`Smart DEX Aggregator`}
            className="text-3xl sm:text-3xl md:text-2xl lg:text-6xl font-bold p-4"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <br />
          <SplitText
            text="with AI Intelligence"
            className="text-2xl sm:text-3xl md:text-2xl lg:text-6xl font-bold p-4"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </h1>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto text-gray-200 leading-relaxed">
          Choose your DEX aggregator wisely. Get real-time liquidity insights,
          MEV protection, and optimal execution timing across all major DEXs.
        </h2>
        <div className="flex sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <Link href="/swap">
            <button className="font-bold cursor-pointer text-red hover:before:bg-black relative h-[50px] w-40 overflow-hidden border border-white bg-white px-3 text-black shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-500 hover:text-white hover:shadow-white hover:before:left-0 hover:before:w-full">
              <span className="relative z-10">Swap Now</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
