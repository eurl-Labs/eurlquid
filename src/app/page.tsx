'use client'

import { Canvas } from '@react-three/fiber'
import { Manrope } from 'next/font/google'
import { Header, HeroSection, Scene } from '@/components/landing'

const manrope = Manrope({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={`relative w-full h-screen bg-black text-white overflow-hidden ${manrope.className}`}>
      <Header />
      <HeroSection />
      <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
        <Scene />
      </Canvas>
    </div>
  )
}
