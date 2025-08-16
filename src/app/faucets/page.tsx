'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load FaucetInterface to reduce initial bundle
const FaucetInterface = dynamic(() => import('./_components/FaucetInterface').then(mod => ({ default: mod.FaucetInterface })), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white/60 text-sm">Loading Faucets...</div>
    </div>
  )
})

export default function FaucetsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-sm animate-pulse">Loading Faucet Interface...</div>
      </div>
    }>
      <FaucetInterface />
    </Suspense>
  )
}
