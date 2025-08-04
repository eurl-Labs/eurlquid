'use client'

export function FeaturesSection() {
  const features = [
    {
      title: "Real-Time Intelligence",
      description: "Stop gambling with outdated snapshots. Get live liquidity data refreshed every second, not every 30 seconds.",
      icon: "⚡"
    },
    {
      title: "MEV Protection",
      description: "Advanced detection of sandwich attacks and frontrunning bots. Execute trades safely with our private mempool integration.",
      icon: "🛡️"
    },
    {
      title: "Optimal Timing",
      description: "AI predicts the best execution windows. Get recommendations like 'Execute now' or 'Wait 5 minutes for better rates'.",
      icon: "🎯"
    }
  ]

  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why Choose Eurlquid?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your DEX aggregator experience from reactive gambling to strategic intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}