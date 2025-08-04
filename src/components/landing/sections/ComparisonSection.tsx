'use client'

export function ComparisonSection() {
  const comparisonData = [
    {
      category: "Data Freshness",
      traditional: "10-30 second snapshots",
      eurlquid: "Real-time updates",
      traditionalIcon: "❌",
      eurlquidIcon: "✅"
    },
    {
      category: "Route Intelligence",
      traditional: "Basic rate comparison",
      eurlquid: "AI-powered predictions + risk analysis",
      traditionalIcon: "❌",
      eurlquidIcon: "✅"
    },
    {
      category: "MEV Protection",
      traditional: "No protection",
      eurlquid: "Advanced sandwich detection",
      traditionalIcon: "❌",
      eurlquidIcon: "✅"
    },
    {
      category: "Execution Strategy",
      traditional: "Execute blindly",
      eurlquid: "Strategic timing recommendations",
      traditionalIcon: "❌",
      eurlquidIcon: "✅"
    }
  ]

  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Before vs After</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how Eurlquid transforms your trading experience
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <div className="grid grid-cols-3 bg-gray-800 text-center py-4">
            <div className="text-gray-400 font-semibold">Feature</div>
            <div className="text-red-400 font-semibold">Traditional Aggregators</div>
            <div className="text-green-400 font-semibold">Eurlquid Enhanced</div>
          </div>
          
          {comparisonData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 text-center py-6 border-b border-gray-800 last:border-b-0">
              <div className="font-semibold text-white px-4">{item.category}</div>
              <div className="text-gray-300 px-4">
                <span className="mr-2">{item.traditionalIcon}</span>
                {item.traditional}
              </div>
              <div className="text-gray-300 px-4">
                <span className="mr-2">{item.eurlquidIcon}</span>
                {item.eurlquid}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}