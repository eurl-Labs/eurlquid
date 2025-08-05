'use client'

export function HeroSection() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center z-10 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
          <span className="block sm:inline">Smart DEX Aggregator</span>
          <span className="block sm:inline"> with AI Intelligence</span>
        </h1>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto text-gray-200 leading-relaxed">
          Choose your DEX aggregator wisely. Get real-time liquidity insights, MEV protection, and optimal execution timing across all major DEXs.
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <a href="/swap" className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition duration-300 inline-block text-sm sm:text-base">
            Swap Now
          </a>
          <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition duration-300 text-sm sm:text-base">
            See How It Works
          </button>
        </div>
      </div>
    </div>
  )
}