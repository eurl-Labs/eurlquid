'use client'

import { useState } from 'react'
import { Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import Image from 'next/image'

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

  // Match with actual logo files from public/images/logo/
  const routes: DexRoute[] = [
    {
      id: 'curve',
      name: 'Curve',
      logo: '/images/logo/curveLogo.png', // Note: need to add this to logo folder
      rate: '0.354987',
      usdValue: '$354.99',
      status: 'recommended',
      slippage: '0.12%',
      time: '~3 min',
      confidence: 95,
      savings: '+$0.16',
      liquidity: 'high',
      mevRisk: 'low',
      details: [
        'Stable liquidity pool',
        'MEV-protected execution',
        'Low slippage guaranteed'
      ]
    },
    {
      id: 'icecreamswap',
      name: 'IceCreamSwap',
      logo: '/images/logo/icecreamswapLogo.ico',
      rate: '0.354825',
      usdValue: '$354.83',
      status: 'recommended',
      slippage: '0.18%',
      time: '~2 min',
      confidence: 88,
      liquidity: 'medium',
      mevRisk: 'low',
      details: [
        'Fast execution',
        'Good liquidity depth',
        'Private mempool'
      ]
    },
    {
      id: 'uniswap',
      name: 'Uniswap V3',
      logo: '/images/logo/uniLogo.svg.png',
      rate: '0.354612',
      usdValue: '$354.61',
      status: 'wait',
      slippage: '0.25%',
      time: '~5 min',
      confidence: 78,
      warning: 'Wait 5 min for better rate',
      liquidity: 'high',
      mevRisk: 'medium',
      details: [
        'Liquidity rebalancing detected',
        'Rate improvement in 5 minutes',
        'High volume pool'
      ]
    },
    {
      id: 'sushiswap',
      name: 'SushiSwap',
      logo: '/images/logo/sushiLogo.png',
      rate: '0.354401',
      usdValue: '$354.40',
      status: 'avoid',
      slippage: '0.35%',
      time: '~4 min',
      confidence: 65,
      warning: 'High MEV risk detected',
      liquidity: 'medium',
      mevRisk: 'high',
      details: [
        'MEV bot activity detected',
        'Sandwich attack risk',
        'Consider alternative route'
      ]
    },
    {
      id: 'balancer',
      name: 'Balancer',
      logo: '/images/logo/balancerLogo.png',
      rate: '0.354756',
      usdValue: '$354.76',
      status: 'wait',
      slippage: '0.22%',
      time: '~8 min',
      confidence: 82,
      warning: 'Better timing in 8 minutes',
      liquidity: 'high',
      mevRisk: 'low',
      details: [
        'Whale exit completing',
        'Liquidity recovering',
        'Optimal timing window ahead'
      ]
    },
    {
      id: '1inch',
      name: '1inch',
      logo: '/images/logo/1inchLogo.png',
      rate: '0.354502',
      usdValue: '$354.50',
      status: 'recommended',
      slippage: '0.28%',
      time: '~3 min',
      confidence: 85,
      liquidity: 'high',
      mevRisk: 'low',
      details: [
        'Aggregated best routes',
        'Multi-path execution',
        'Optimized gas usage'
      ]
    }
  ]

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
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">+$0.16</div>
            <div className="text-sm text-white/60">Best Savings</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">0.12%</div>
            <div className="text-sm text-white/60">Min Slippage</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">95%</div>
            <div className="text-sm text-white/60">AI Confidence</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-white/60">Risk Alerts</div>
          </div>
        </div>
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