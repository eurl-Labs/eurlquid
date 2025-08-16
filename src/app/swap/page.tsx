'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Manrope } from 'next/font/google'

// Lazy load SwapInterface to reduce initial bundle
const SwapInterface = dynamic(() => import('@/components/swap/SwapInterface').then(mod => ({ default: mod.SwapInterface })), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white/60 text-sm">Loading Swap...</div>
    </div>
  )
})

const manrope = Manrope({ subsets: ['latin'] })

export default function SwapPage() {
  return (
    <div className={`min-h-screen bg-black ${manrope.className}`}>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white/60 text-sm animate-pulse">Loading Swap Interface...</div>
        </div>
      }>
        <SwapInterface />
      </Suspense>
    </div>
  )
}