'use client'

import { useState, useMemo } from 'react'
import { Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import Image from 'next/image'
import { useAnalysisStore } from '@/store/userprompt-store'

interface RoutesListProps {
  fromAmount: string
  fromToken: string
  toToken: string
}

interface DexRoute {
  id: string
  name: string
  logo: string
  rate: string
  usdValue: string
  status: 'recommended' | 'wait' | 'avoid' | 'executing'
  slippage: string
  time: string
  confidence: number
  savings?: string
  warning?: string
  liquidity: 'high' | 'medium' | 'low'
  mevRisk: 'low' | 'medium' | 'high'
  details: string[]
}

export function RoutesList({ fromAmount, fromToken, toToken }: RoutesListProps) {
  const [selectedRoute, setSelectedRoute] = useState<string>('curve')
  const { analysis, data, loading, error } = useAnalysisStore()

  // Generate routes from real analysis data
  const routes: DexRoute[] = useMemo(() => {
    if (!analysis?.parsed || !data) {
      // Fallback to basic structure if no analysis available
      return [
        {
          id: 'uniswap',
          name: 'Uniswap V3',
          logo: '/images/logo/uniLogo.svg.png',
          rate: '0.000000',
          usdValue: '$0.00',
          status: 'wait',
          slippage: '0.00%',
          time: '~3 min',
          confidence: 0,
          liquidity: 'medium',
          mevRisk: 'medium',
          details: ['Analysis pending...']
        }
      ]
    }

    const aiData = analysis.parsed
    const dexData = data.dex
    const priceData = data.prices

    // Use AI dexAnalysis if available, otherwise fallback to calculation
    const dexAnalysis = aiData.dexAnalysis || {}

    // Generate routes based on AI individual DEX analysis
    const generatedRoutes: DexRoute[] = []

    // DEX configurations with AI analysis integration
    const dexConfigs = [
      {
        id: 'uniswap',
        name: 'Uniswap V3',
        logo: '/images/logo/uniLogo.svg.png',
        hasData: !!dexData?.uniswap?.data?.pools?.length,
        poolCount: dexData?.uniswap?.data?.pools?.length || 0,
        aiAnalysis: dexAnalysis.uniswap
      },
      {
        id: 'curve',
        name: 'Curve',
        logo: '/images/logo/curveLogo.png',
        hasData: !!dexData?.curve?.data?.pools?.length,
        poolCount: dexData?.curve?.data?.pools?.length || 0,
        aiAnalysis: dexAnalysis.curve
      },
      {
        id: 'balancer',
        name: 'Balancer',
        logo: '/images/logo/balancerLogo.png',
        hasData: !!dexData?.balancer?.data?.pools?.length,
        poolCount: dexData?.balancer?.data?.pools?.length || 0,
        aiAnalysis: dexAnalysis.balancer
      },
      {
        id: '1inch',
        name: '1inch',
        logo: '/images/logo/1inchLogo.png',
        hasData: !!dexData?.oneinch,
        poolCount: 1,
        aiAnalysis: dexAnalysis.oneinch
      }
    ]

    dexConfigs.forEach((dex, index) => {
      const aiDexData = dex.aiAnalysis
      
      // Use AI analysis data if available
      if (aiDexData) {
        const status: DexRoute['status'] = 
          aiDexData.status === 'execute_now' ? 'recommended' :
          aiDexData.status === 'wait' || aiDexData.status?.includes('wait') ? 'wait' : 'avoid'

        // Parse AI provided data
        const rate = aiDexData.rate || '0.000000'
        const usdValue = aiDexData.usdValue || '$0.00'
        const slippage = aiDexData.slippage || '0.00%'
        const confidence = Math.round((aiDexData.confidence || 0.5) * 100)
        const allocation = aiDexData.allocation || 0
        const timeToOptimal = aiDexData.timeToOptimal || 'unknown'
        
        // Determine liquidity level
        const liquidity: DexRoute['liquidity'] = 
          aiDexData.liquidity === 'high' ? 'high' :
          aiDexData.liquidity === 'low' ? 'low' : 'medium'
        
        // Determine MEV risk
        const mevRisk: DexRoute['mevRisk'] = 
          aiDexData.mevRisk === 'high' ? 'high' :
          aiDexData.mevRisk === 'low' ? 'low' : 'medium'

        // Generate details from AI analysis
        const details = [
          aiDexData.reasoning || 'AI analysis available',
          `TVL: ${aiDexData.tvl || 'Unknown'}`,
          `Fees: ${aiDexData.fees || 'Unknown'}`,
        ]

        if (allocation > 0) {
          details.push(`${(allocation * 100).toFixed(1)}% allocation recommended`)
        }

        // Calculate time display
        const timeDisplay = status === 'recommended' ? 
          `~${timeToOptimal === 'now' ? '2' : timeToOptimal}` :
          `~${timeToOptimal === 'unknown' ? '5' : timeToOptimal}`

        generatedRoutes.push({
          id: dex.id,
          name: dex.name,
          logo: dex.logo,
          rate: parseFloat(rate).toFixed(6),
          usdValue: usdValue,
          status,
          slippage: slippage,
          time: timeDisplay.includes('min') ? timeDisplay : `~${timeDisplay} min`,
          confidence: confidence,
          savings: allocation > 0.2 ? `+$${(allocation * 10).toFixed(2)}` : undefined,
          warning: status === 'wait' ? `Better timing in ${timeToOptimal}` : 
                   status === 'avoid' ? 'Limited liquidity' : undefined,
          liquidity,
          mevRisk,
          details: details.filter(Boolean)
        })
      } else {
        // Fallback calculation if no AI analysis for this DEX
        const fromPrice = priceData?.fromToken?.price || 0
        const toPrice = priceData?.toToken?.price || 1
        const baseRate = fromPrice > 0 && toPrice > 0 ? (parseFloat(fromAmount) * fromPrice) / toPrice : 0

        // Find allocation from optimal route
        const optimalRoute = aiData.optimalRoute || []
        const aiRoute = optimalRoute.find((r: any) => 
          r.dex?.toLowerCase().includes(dex.id) || 
          (dex.id === 'uniswap' && r.dex?.toLowerCase().includes('uniswap'))
        )
        
        const allocation = aiRoute?.allocation || 0
        const aiStatus = aiRoute?.status || 'wait'
        
        // Calculate estimated rate with some variance
        let rateMultiplier = 1
        if (dex.id === 'curve') rateMultiplier = 1.0005
        if (dex.id === '1inch') rateMultiplier = 0.9998
        if (dex.id === 'balancer') rateMultiplier = 1.0002
        if (dex.id === 'uniswap') rateMultiplier = 0.9999

        const estimatedRate = baseRate * rateMultiplier
        const usdValue = estimatedRate * (toPrice || 1)

        // Determine status
        let status: DexRoute['status'] = 'wait'
        if (aiStatus === 'execute_now' && allocation > 0) status = 'recommended'
        if (allocation === 0 || !dex.hasData) status = 'avoid'
        if (aiStatus.includes('wait')) status = 'wait'

        const baseSlippage = dex.id === 'curve' ? 0.1 : dex.id === 'uniswap' ? 0.3 : 0.25
        const slippage = (baseSlippage + (allocation * 0.1)).toFixed(2)

        let liquidity: DexRoute['liquidity'] = 'medium'
        if (dex.poolCount > 10 || dex.id === '1inch') liquidity = 'high'
        if (dex.poolCount < 3) liquidity = 'low'

        const mevRisk: DexRoute['mevRisk'] = 
          dex.id === 'curve' ? 'low' : 
          dex.id === 'balancer' ? 'low' :
          dex.id === '1inch' ? 'low' : 'medium'

        const details = []
        if (dex.hasData) {
          details.push(`${dex.poolCount} pools available`)
          if (allocation > 0) {
            details.push(`${(allocation * 100).toFixed(1)}% allocation recommended`)
          }
          if (status === 'recommended') {
            details.push('Optimal execution timing')
          }
        } else {
          details.push('No liquidity data available')
        }

        generatedRoutes.push({
          id: dex.id,
          name: dex.name,
          logo: dex.logo,
          rate: estimatedRate.toFixed(6),
          usdValue: `$${usdValue.toFixed(2)}`,
          status,
          slippage: `${slippage}%`,
          time: status === 'recommended' ? '~2 min' : status === 'wait' ? '~5 min' : '~N/A',
          confidence: Math.round((aiData.prediction?.confidence || 0.5) * 100),
          savings: allocation > 0.3 ? `+$${(allocation * 2.5).toFixed(2)}` : undefined,
          warning: status === 'wait' ? 'Better timing detected' : status === 'avoid' ? 'Limited liquidity' : undefined,
          liquidity,
          mevRisk,
          details
        })
      }
    })

    // Sort routes: recommended first, then by rate
    return generatedRoutes.sort((a, b) => {
      if (a.status === 'recommended' && b.status !== 'recommended') return -1
      if (b.status === 'recommended' && a.status !== 'recommended') return 1
      return parseFloat(b.rate) - parseFloat(a.rate)
    })
  }, [analysis, data, fromAmount, fromToken, toToken])

  // Calculate summary stats from AI analysis
  const summaryStats = useMemo(() => {
    if (!analysis?.parsed) {
      return {
        bestSavings: '$0.00',
        minSlippage: '0.00%',
        aiConfidence: '0%',
        riskAlerts: 0
      }
    }

    const aiData = analysis.parsed
    const bestRoute = routes.find(r => r.status === 'recommended')
    
    return {
      bestSavings: aiData.expectedSavingsUSD ? `$${aiData.expectedSavingsUSD}` : bestRoute?.savings || '$0.00',
      minSlippage: aiData.expectedSlippage || routes.reduce((min, r) => 
        parseFloat(r.slippage) < parseFloat(min) ? r.slippage : min, '99.99%'),
      aiConfidence: `${Math.round((aiData.prediction?.confidence || 0) * 100)}%`,
      riskAlerts: aiData.riskAlerts?.length || 0
    }
  }, [analysis, routes])

  const getStatusIcon = (status: DexRoute['status']) => {
    switch (status) {
      case 'recommended':
        return <CheckCircle className="w-5 h-5 text-white" />
      case 'wait':
        return <Clock className="w-5 h-5 text-white" />
      case 'avoid':
        return <AlertTriangle className="w-5 h-5 text-white" />
      case 'executing':
        return <Zap className="w-5 h-5 text-white" />
    }
  }

  const getStatusColor = (status: DexRoute['status']) => {
    switch (status) {
      case 'recommended':
        return 'border-white/10 bg-white/5'
      case 'wait':
        return 'border-white/10 bg-white/5'
      case 'avoid':
        return 'border-white/10 bg-white/5'
      case 'executing':
        return 'border-white/10 bg-white/5'
    }
  }

  const getLiquidityColor = (liquidity: DexRoute['liquidity']) => {
    switch (liquidity) {
      case 'high': return 'text-white'
      case 'medium': return 'text-white/80'
      case 'low': return 'text-white/60'
    }
  }

  const getMevRiskColor = (risk: DexRoute['mevRisk']) => {
    switch (risk) {
      case 'low': return 'text-white'
      case 'medium': return 'text-white/80'
      case 'high': return 'text-white/60'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Smart Route Analysis</h3>
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <span>Analyzing {routes.length} DEX aggregators</span>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span>{loading ? 'Analyzing...' : error ? 'Error' : 'Live data'}</span>
            </div>
          </div>
        </div>
        {/* header summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">{loading ? '...' : summaryStats.bestSavings}</div>
            <div className="text-sm text-white/60">Best Savings</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">{loading ? '...' : summaryStats.minSlippage}</div>
            <div className="text-sm text-white/60">Min Slippage</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">{loading ? '...' : summaryStats.aiConfidence}</div>
            <div className="text-sm text-white/60">AI Confidence</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">{loading ? '...' : summaryStats.riskAlerts}</div>
            <div className="text-sm text-white/60">Risk Alerts</div>
          </div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">Analysis Error: {error}</span>
            </div>
          </div>
        )}

        {/* AI Risk Alerts */}
        {analysis?.parsed?.riskAlerts && analysis.parsed.riskAlerts.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-white/80">Risk Alerts:</h4>
            {analysis.parsed.riskAlerts.map((alert: string, idx: number) => (
              <div key={idx} className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                  <span className="text-orange-400 text-xs">{alert}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Advice */}
        {analysis?.parsed?.advice && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">AI Recommendation:</span>
            </div>
            <p className="text-white/80 text-sm mt-1">{analysis.parsed.advice}</p>
          </div>
        )}
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {routes.map((route, index) => (
          <div
            key={route.id}
            className={`backdrop-blur-lg bg-white/5 border-2 rounded-xl p-6 transition-all duration-200 hover:bg-white/10 cursor-pointer ${
              selectedRoute === route.id ? 'border-white/10' : getStatusColor(route.status)
            }`}
            onClick={() => setSelectedRoute(route.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <Image
                    src={route.logo}
                    alt={`${route.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-white text-lg">{route.name}</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(route.status)}
                      {index === 0 && (
                        <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/10">
                          Best Rate
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span>Liquidity: <span className={getLiquidityColor(route.liquidity)}>{route.liquidity}</span></span>
                    <span>MEV Risk: <span className={getMevRiskColor(route.mevRisk)}>{route.mevRisk}</span></span>
                    <span>Time: {route.time}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">{route.rate} {toToken}</div>
                <div className="text-white/60">{route.usdValue}</div>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  {route.savings && (
                    <span className="text-white text-sm font-medium">{route.savings}</span>
                  )}
                  <span className="text-white/60 text-sm">Slippage: {route.slippage}</span>
                </div>
              </div>
            </div>

            {/* Route Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {route.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white/60">AI Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${route.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{route.confidence}%</span>
                  </div>
                </div>

                {route.status === 'recommended' && (
                  <button className="px-4 py-2 bg-white hover:bg-gray-200 text-black text-sm font-semibold rounded-lg transition-all duration-200">
                    Execute Now
                  </button>
                )}
                
                {route.status === 'wait' && (
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-all duration-200 border border-white/10">
                    Set Alert
                  </button>
                )}
              </div>
            </div>

            {route.warning && (
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">{route.warning}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}