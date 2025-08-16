'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect } from 'react'
import { Manrope } from 'next/font/google'
import { Header, HeroSection } from '@/components/landing'

// Lazy load Canvas and Scene together
const ThreeJSCanvas = dynamic(() => import('@/components/landing/three/ThreeJSCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
})

const DexScrollSection = dynamic(() => import('@/components/landing/infinite-scroll/DexScrollSection'), {
  loading: () => <div className="h-32 bg-gray-900/50 animate-pulse" />
})

const UniswapShowcase = dynamic(() => import('@/components/landing/chroma-grid/UniswapShowcase'), {
  loading: () => <div className="h-96 bg-gray-900/50 animate-pulse" />
})

const SwapSmartSection = dynamic(() => import('@/components/landing/sections/SwapSmartSection').then(mod => ({ default: mod.SwapSmartSection })), {
  loading: () => <div className="h-64 bg-gray-900/50 animate-pulse" />
})

const manrope = Manrope({ subsets: ['latin'] })

export default function Home() {
  const [showThreeJS, setShowThreeJS] = useState(false)

  useEffect(() => {
    // Delay 3D loading until after critical content is rendered
    const timer = setTimeout(() => {
      setShowThreeJS(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`relative w-full bg-black text-white ${manrope.className}`}>
      <div className="relative w-full h-screen overflow-hidden">
        <Header />
        <HeroSection/>
        {showThreeJS && (
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />}>
            <ThreeJSCanvas />
          </Suspense>
        )}
      </div>
      <Suspense fallback={<div className="h-96 bg-gray-900/50 animate-pulse" />}>
        <UniswapShowcase />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-gray-900/50 animate-pulse" />}>
        <DexScrollSection />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-gray-900/50 animate-pulse" />}>
        <SwapSmartSection />
      </Suspense>
    </div>
  )
}
