'use client'

import { BridgeInterface } from '@/components/bridge/BridgeInterface'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'] })

export default function SwapPage() {
  return (
    <div className={`min-h-screen bg-black ${manrope.className}`}>
      <BridgeInterface />
    </div>
  )
}