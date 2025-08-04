'use client'

export function ExampleSection() {
  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Smart Trading in Action</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real example: Swapping $10,000 USDC → ETH
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Traditional Way */}
          <div className="bg-gray-900 rounded-lg p-8 border border-red-800">
            <h3 className="text-2xl font-bold mb-6 text-red-400">❌ Traditional Aggregator</h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-green-400 font-bold">🥇 Uniswap: 2.847 ETH (Best rate)</div>
                <div className="text-gray-400 text-sm">Based on 30-second old data</div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-300">User clicks "Uniswap" because highest number</div>
              </div>
              <div className="bg-red-900 p-4 rounded border border-red-700">
                <div className="text-red-300 font-bold">⚠️ Result: Gets sandwich attacked</div>
                <div className="text-red-300">Actual receive: 2.831 ETH</div>
                <div className="text-red-300 font-bold">Loss: $48 vs expected</div>
              </div>
            </div>
          </div>

          {/* Eurlquid Way */}
          <div className="bg-gray-900 rounded-lg p-8 border border-green-800">
            <h3 className="text-2xl font-bold mb-6 text-green-400">✅ Eurlquid Enhanced</h3>
            <div className="space-y-4">
              <div className="bg-green-900 p-4 rounded border border-green-700">
                <div className="text-green-300 font-bold">🥇 Curve: 2.845 ETH [RECOMMENDED]</div>
                <div className="text-green-200 text-sm">💡 Stable liquidity, MEV-protected pool</div>
                <div className="text-green-200 text-sm">⏱️ Execute within 3 minutes</div>
                <div className="text-green-200 text-sm">🛡️ Sandwich risk: Very Low</div>
              </div>
              <div className="bg-yellow-900 p-4 rounded border border-yellow-700">
                <div className="text-yellow-300 font-bold">🚫 Uniswap: 2.847 ETH [HIGH RISK]</div>
                <div className="text-yellow-200 text-sm">⚠️ MEV bot activity detected</div>
                <div className="text-yellow-200 text-sm">🎯 Actual expected: 2.831 ETH</div>
              </div>
              <div className="bg-blue-900 p-4 rounded border border-blue-700">
                <div className="text-blue-300 font-bold">🎯 Optimal Strategy:</div>
                <div className="text-blue-200 text-sm">Execute via Curve now</div>
                <div className="text-blue-200 text-sm font-bold">Expected: 2.845 ETH (Save $12)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}