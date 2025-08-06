'use client'

import Image from 'next/image'
import { Manrope } from 'next/font/google'
import { SwapNavbar } from '@/components/swap/SwapNavbar'
import { Search, BarChart3, Users, TrendingUp, DollarSign, Shield, Target, Activity } from 'lucide-react'

const manrope = Manrope({ subsets: ['latin'] })

export default function LiquidityExplorer() {
  const poolSections = [
    { name: 'Pool health analytics', icon: Activity },
    { name: 'Liquidity provider rankings', icon: Users },
    { name: 'Historical depth charts', icon: BarChart3 },
    { name: 'Fee analysis across protocols', icon: DollarSign },
    { name: 'Entry/exit timing recommendations', icon: Target },
    { name: 'Pool comparison tools', icon: TrendingUp }
  ]

  const dexAggregatorsByLiquidity = [
    {
      name: 'Uniswap V3',
      tvl: '$4.2B',
      logo: '/images/logo/uniLogo.svg.png',
      apy: '8.2%',
      volume24h: '$891M',
      pairs: 2847,
      color: '#FF007A'
    },
    {
      name: 'Curve Finance',
      tvl: '$3.8B',
      logo: '/images/logo/curveLogo.png',
      apy: '6.7%',
      volume24h: '$634M',
      pairs: 1205,
      color: '#FF6B35'
    },
    {
      name: 'Balancer V2',
      tvl: '$1.9B',
      logo: '/images/logo/balancerLogo.png',
      apy: '15.3%',
      volume24h: '$312M',
      pairs: 895,
      color: '#536DFE'
    },
    {
      name: '1inch',
      tvl: '$1.4B',
      logo: '/images/logo/1inchLogo.png',
      apy: '9.1%',
      volume24h: '$287M',
      pairs: 1650,
      color: '#1F2937'
    },
    {
      name: 'SushiSwap',
      tvl: '$987M',
      logo: '/images/logo/sushiLogo.png',
      apy: '12.4%',
      volume24h: '$198M',
      pairs: 1423,
      color: '#FA52A0'
    },
    {
      name: 'Odos',
      tvl: '$743M',
      logo: '/images/logo/odosLogo.png',
      apy: '11.8%',
      volume24h: '$156M',
      pairs: 567,
      color: '#6966FF'
    },
    {
      name: 'Matcha',
      tvl: '$612M',
      logo: '/images/logo/matchaLogo.png',
      apy: '10.5%',
      volume24h: '$134M',
      pairs: 789,
      color: '#00D395'
    },
    {
      name: 'Orca',
      tvl: '$445M',
      logo: '/images/logo/orcaLogo.png',
      apy: '14.2%',
      volume24h: '$98M',
      pairs: 234,
      color: '#B6509E'
    },
    {
      name: 'SilverSwap',
      tvl: '$298M',
      logo: '/images/logo/silverswapLogo.png',
      apy: '18.7%',
      volume24h: '$67M',
      pairs: 156,
      color: '#31CB9E'
    },
    {
      name: 'IceCreamSwap',
      tvl: '$156M',
      logo: '/images/logo/icecreamswapLogo.ico',
      apy: '22.3%',
      volume24h: '$34M',
      pairs: 89,
      color: '#FF6B9D'
    }
  ]

  const featuredInsights = [
    {
      label: 'Highest TVL',
      value: 'Uniswap V3',
      note: '($4.2B)',
      logo: '/images/logo/uniLogo.svg.png'
    },
    {
      label: 'Best APY',
      value: 'IceCreamSwap',
      note: '(22.3%)',
      logo: '/images/logo/icecreamswapLogo.ico'
    },
    {
      label: 'Most Volume',
      value: 'Uniswap V3',
      note: '($891M/24h)',
      logo: '/images/logo/uniLogo.svg.png'
    }
  ]

  return (
    <div className={`min-h-screen bg-black text-white ${manrope.className}`}>
      {/* Navigation */}
      <SwapNavbar />
      
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2 ml-5">
            <h1 className="text-3xl font-bold">Liquidity Explorer</h1>
          </div>
          <p className="text-white/60 text-sm ml-5">Deep dive into liquidity pools</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black border border-white/10 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-400" />
                <span>Pool Intelligence Explorer</span>
              </h2>
              <nav className="space-y-2">
                {poolSections.map((section, index) => {
                  const Icon = section.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md cursor-pointer transition-all duration-150 border-l-2 border-transparent hover:border-white"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{section.name}</span>
                    </div>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Insights */}
            <div className="bg-black border border-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium mb-6">Featured Insights</h3>
              <div className="space-y-4">
                {featuredInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Image
                          src={insight.logo}
                          alt={insight.value}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                          {insight.label}
                        </div>
                        <div className="font-medium">{insight.value}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{insight.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pool Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h4 className="font-medium">Pool Health Analytics</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Volume (24h)</span>
                    <span className="font-medium">$2.4B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Active Pools</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Avg. APY</span>
                    <span className="font-medium text-green-400">12.4%</span>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h4 className="font-medium">Top Liquidity Providers</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">#1 Provider</span>
                    <span className="font-medium">$847M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">#2 Provider</span>
                    <span className="font-medium">$623M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">#3 Provider</span>
                    <span className="font-medium">$451M</span>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h4 className="font-medium">Protocol Comparison</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/images/logo/uniLogo.svg.png"
                        alt="Uniswap"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      <span className="text-sm">Uniswap V3</span>
                    </div>
                    <span className="text-sm font-medium">8.2% APY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/images/logo/curveLogo.png"
                        alt="Curve"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      <span className="text-sm">Curve Finance</span>
                    </div>
                    <span className="text-sm font-medium">6.7% APY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/images/logo/balancerLogo.png"
                        alt="Balancer"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      <span className="text-sm">Balancer V2</span>
                    </div>
                    <span className="text-sm font-medium">15.3% APY</span>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-orange-400" />
                  <h4 className="font-medium">Market Timing</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Best Entry Time</span>
                    <span className="font-medium text-green-400">Now</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Volatility</span>
                    <span className="font-medium text-yellow-400">Medium</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Risk Level</span>
                    <span className="font-medium text-red-400">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DEX Aggregators by Liquidity */}
            <div className="mt-8 bg-black border border-white/10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-medium">DEX Aggregators by Total Value Locked (TVL)</h3>
              </div>
              
              <div className="space-y-4">
                {dexAggregatorsByLiquidity.map((dex, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-400 w-8">
                          #{index + 1}
                        </div>
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center p-2"
                          style={{ backgroundColor: `${dex.color}20` }}
                        >
                          <Image
                            src={dex.logo}
                            alt={dex.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">{dex.name}</div>
                          <div className="text-sm text-gray-400">{dex.pairs} pairs</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">TVL</div>
                        <div className="font-medium text-white">{dex.tvl}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">24h Volume</div>
                        <div className="font-medium text-white">{dex.volume24h}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">APY</div>
                        <div className="font-medium text-green-400">{dex.apy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}