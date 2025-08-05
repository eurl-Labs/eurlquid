'use client'

import { SwapInterface } from '@/components/swap/SwapInterface'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'] })

export default function SwapPage() {
  return (
    <div className={`min-h-screen bg-black ${manrope.className}`}>
      <SwapInterface />
    </div>
  )
}