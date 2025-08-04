'use client'

import { OrbitControls, Grid } from '@react-three/drei'
import { DexLogoBox } from './DexLogoBox'
import { CollisionProvider } from './CollisionManager'

export function Scene() {
  // Spread out positions more to avoid initial collisions
  const dexLogos = [
    { position: [-15, 0.5, -12] as [number, number, number], path: '/images/logo/1inchLogo.png', name: '1inch' },
    { position: [-6, 0.5, -15] as [number, number, number], path: '/images/logo/uniLogo.svg.png', name: 'Uniswap' },
    { position: [0, 0.5, 0] as [number, number, number], path: '/images/logo/sushiLogo.png', name: 'SushiSwap' },
    { position: [6, 0.5, 12] as [number, number, number], path: '/images/logo/balancerLogo.png', name: 'Balancer' },
    { position: [15, 0.5, 9] as [number, number, number], path: '/images/logo/orcaLogo.png', name: 'Orca' },
    { position: [-12, 0.5, 9] as [number, number, number], path: '/images/logo/matchaLogo.png', name: 'Matcha' },
    { position: [9, 0.5, -9] as [number, number, number], path: '/images/logo/odosLogo.png', name: 'Odos' },
    { position: [-18, 0.5, 3] as [number, number, number], path: '/images/logo/silverswapLogo.png', name: 'SilverSwap' },
    { position: [18, 0.5, -3] as [number, number, number], path: '/images/logo/icecreamswapLogo.ico', name: 'IceCreamSwap' },
  ]

  return (
    <CollisionProvider>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#808080"
        fadeDistance={50}
      />
      {dexLogos.map((dex, index) => (
        <DexLogoBox 
          key={index} 
          initialPosition={dex.position} 
          logoPath={dex.path}
          name={dex.name}
        />
      ))}
    </CollisionProvider>
  )
}