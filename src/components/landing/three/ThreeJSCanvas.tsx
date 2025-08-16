'use client'

import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'

export default function ThreeJSCanvas() {
  return (
    <Canvas 
      shadows 
      camera={{ position: [30, 30, 30], fov: 50 }} 
      className="absolute inset-0"
      gl={{ 
        antialias: false, 
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
    >
      <Scene />
    </Canvas>
  )
}