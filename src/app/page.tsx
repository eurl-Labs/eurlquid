'use client'

import { Canvas } from '@react-three/fiber'
import { Manrope } from 'next/font/google'
import { Header, HeroSection, Scene } from '@/components/landing'
import { DexScrollSection } from '@/components/landing/infinite-scroll'
import { UniswapShowcase } from '@/components/landing/chroma-grid'

const manrope = Manrope({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={`relative w-full bg-black text-white ${manrope.className}`}>
      <div className="relative w-full h-screen overflow-hidden">
        <Header />
        <HeroSection />
        <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
          <Scene />
        </Canvas>
      </div>
      <UniswapShowcase />
      <DexScrollSection />
    </div>
  )
}
