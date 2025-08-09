'use client'

import { useState } from 'react'
import { Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import Image from 'next/image'

interface RoutesListProps {
  fromAmount: string
  fromToken: string
  toToken: string
}

interface BridgeRoute {
  id: string
  name: string
  logo: string
  rate: string
  usdValue: string
  status: 'recommended' | 'wait' | 'avoid' | 'executing'
  fee: string
  time: string
  confidence: number
  savings?: string
  warning?: string
  security: 'high' | 'medium' | 'low'
  speed: 'fast' | 'medium' | 'slow'
  details: string[]
}

export function RoutesList({ fromAmount, fromToken, toToken }: RoutesListProps) {
  const [selectedRoute, setSelectedRoute] = useState<string>('curve')

  // Bridge protocols
  const routes: BridgeRoute[] = [
    {
      id: 'layerzero',
      name: 'LayerZero',
      logo: '/images/logo/layerzeroLogo.jpeg', 
      rate: '0.99821',
      usdValue: '$998.21',
      status: 'recommended',
      fee: '0.1%',
      time: '~2-5 min',
      confidence: 98,
      savings: '+$2.45',
      security: 'high',
      speed: 'fast',
      details: [
        'Omnichain protocol',
        'Ultra-light nodes',
        'Security audited'
      ]
    },
       {
      id: 'dbridge',
      name: 'dBridge',
      logo: '/images/logo/debridgeLogo.svg',
      rate: '0.99401',
      usdValue: '$994.01',
      status: 'avoid',
      fee: '0.35%',
      time: '~15-25 min',
      confidence: 72,
      warning: 'High fees and slow processing',
      security: 'medium',
      speed: 'slow',
      details: [
        'Decentralized bridge network',
        'Cross-chain liquidity',
        'Extended confirmation time'
      ]
    },
    {
      id: 'stargate',
      name: 'Stargate Finance',
      logo: '/images/logo/stargateLogo.png',
      rate: '0.99756',
      usdValue: '$997.56',
      status: 'recommended',
      fee: '0.15%',
      time: '~3-7 min',
      confidence: 94,
      savings: '+$1.80',
      security: 'high',
      speed: 'fast',
      details: [
        'Native asset transfer',
        'Unified liquidity',
        'Instant guaranteed finality'
      ]
    },
    {
      id: 'wormhole',
      name: 'Wormhole Bridge',
      logo: '/images/logo/wormholeLogo.png',
      rate: '0.99634',
      usdValue: '$996.34',
      status: 'wait',
      fee: '0.25%',
      time: '~10-15 min',
      confidence: 87,
      warning: 'Network congestion detected',
      security: 'high',
      speed: 'medium',
      details: [
        'Guardian network validation',
        'Multi-chain support',
        'High throughput'
      ]
    },
    {
      id: 'hyperlane',
      name: 'Hyperlane',
      logo: '/images/logo/hyperlaneLogo.avif',
      rate: '0.99512',
      usdValue: '$995.12',
      status: 'recommended',
      fee: '0.18%',
      time: '~4-8 min',
      confidence: 91,
      security: 'high',
      speed: 'fast',
      details: [
        'Modular interoperability',
        'Sovereign consensus',
        'Permissionless deployment'
      ]
    },
  ]

  const getStatusIcon = (status: BridgeRoute['status']) => {
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

  const getStatusColor = (status: BridgeRoute['status']) => {
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

  const getSecurityColor = (security: BridgeRoute['security']) => {
    switch (security) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-red-400'
    }
  }

  const getSpeedColor = (speed: BridgeRoute['speed']) => {
    switch (speed) {
      case 'fast': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'slow': return 'text-red-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Bridge Route Analysis</h3>
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <span>Analyzing {routes.length} bridge protocols</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">+$2.45</div>
            <div className="text-sm text-white/60">Best Savings</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">0.1%</div>
            <div className="text-sm text-white/60">Lowest Fee</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-sm text-white/60">Security Score</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">2-5</div>
            <div className="text-sm text-white/60">Min Transfer</div>
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
                    <span>Security: <span className={getSecurityColor(route.security)}>{route.security}</span></span>
                    <span>Speed: <span className={getSpeedColor(route.speed)}>{route.speed}</span></span>
                    <span>Time: {route.time}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">{route.rate} {toToken}</div>
                <div className="text-white/60">{route.usdValue}</div>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  {route.savings && (
                    <span className="text-green-400 text-sm font-medium">{route.savings}</span>
                  )}
                  <span className="text-white/60 text-sm">Fee: {route.fee}</span>
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
                  <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg transition-all duration-200">
                    Bridge Now
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