'use client'

import { useState } from 'react'
import { SwapNavbar } from './SwapNavbar'
import { SwapCard } from './SwapCard'
import { RoutesList } from './RoutesList'
import { Zap, TrendingUp, Shield } from 'lucide-react'

export function SwapInterface() {
  const [fromAmount, setFromAmount] = useState('')
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')

  return (
    <div className="min-h-screen">
      <SwapNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Swap Panel */}
          <div className="lg:col-span-1">
            <SwapCard 
              fromAmount={fromAmount}
              setFromAmount={setFromAmount}
              fromToken={fromToken}
              setFromToken={setFromToken}
              toToken={toToken}
              setToToken={setToToken}
            />
            
            {/* Smart Features */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">Real-time Intelligence</span>
                </div>
                <span className="text-white text-sm font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">MEV Protection</span>
                </div>
                <span className="text-white text-sm font-medium">Enabled</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">AI Predictions</span>
                </div>
                <span className="text-white text-sm font-medium">Running</span>
              </div>
            </div>
          </div>

          {/* Routes Panel */}
          <div className="lg:col-span-2">
            <RoutesList 
              fromAmount={fromAmount}
              fromToken={fromToken}
              toToken={toToken}
            />
          </div>
        </div>
      </div>
    </div>
  )
}