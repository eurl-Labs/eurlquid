'use client'

export function HeroSection() {
  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
      <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto">
        Smart DEX Aggregator with AI Intelligence
      </h1>
      <h2 className="text-xl mb-10 max-w-3xl mx-auto">
        Choose your DEX aggregator wisely. Get real-time liquidity insights, MEV protection, and optimal execution timing across all major DEXs.
      </h2>
      <div className="flex gap-4 justify-center">
        <button className="bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
          Launch App
        </button>
        <button className="border border-white text-white font-bold py-3 px-6 rounded-md hover:bg-white hover:text-black transition duration-300">
          See How It Works
        </button>
      </div>
    </div>
  )
}