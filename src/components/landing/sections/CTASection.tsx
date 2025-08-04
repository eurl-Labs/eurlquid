'use client'

export function CTASection() {
  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-8">
          Stop Losing Money to Stale Data
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Join thousands of traders who save 0.1-0.5% on every swap with Eurlquid's 
          AI-powered liquidity intelligence. That's $100-500 saved per $100k trade.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button className="bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-gray-200 transition duration-300 text-lg">
            Start Trading Smarter
          </button>
          <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-black transition duration-300 text-lg">
            Watch Demo
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">$2M+</div>
            <div className="text-gray-300">Saved in slippage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-gray-300">DEXs monitored</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-gray-300">Uptime guaranteed</div>
          </div>
        </div>
      </div>
    </section>
  )
}