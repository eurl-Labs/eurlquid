'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Manrope } from 'next/font/google'

const BridgeInterface = dynamic(() => import('@/components/bridge/BridgeInterface').then(mod => ({ default: mod.BridgeInterface })), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white/60 text-sm">Loading Bridge...</div>
    </div>
  )
})

const manrope = Manrope({ subsets: ['latin'] })

export default function BridgePage() {
  return (
    <div className={`min-h-screen bg-black ${manrope.className}`}>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white/60 text-sm animate-pulse">Loading Bridge Interface...</div>
        </div>
      }>
        <BridgeInterface />
      </Suspense>
    </div>
  )
}