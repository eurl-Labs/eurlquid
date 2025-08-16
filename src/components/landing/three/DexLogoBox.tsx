'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, useMemo } from 'react'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { useCollision } from './CollisionManager'

interface DexLogoBoxProps {
  initialPosition: [number, number, number]
  logoPath: string
  name: string
}

export function DexLogoBox({ initialPosition, logoPath, name }: DexLogoBoxProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))
  const [isVisible] = useState(true)
  const { registerPosition, unregisterPosition, checkCollision, updatePosition } = useCollision()
  
  // Memoize texture loading to prevent reloads
  const texture = useMemo(() => {
    const loader = new TextureLoader()
    return loader.load(logoPath)
  }, [logoPath])

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 4,
      0.5,
      current.z + randomDirection[1] * 4
    )
  }

  useEffect(() => {
    // Register this object's position
    registerPosition(name, currentPosition.current)
    
    // Use longer intervals and pause when tab is not active
    const interval = setInterval(() => {
      if (!document.hasFocus()) return // Don't animate when tab is not active
      
      let attempts = 0
      let newPosition: THREE.Vector3
      
      do {
        newPosition = getAdjacentIntersection(currentPosition.current)
        newPosition.x = Math.max(-18, Math.min(18, newPosition.x))
        newPosition.z = Math.max(-18, Math.min(18, newPosition.z))
        attempts++
      } while (checkCollision(name, newPosition) && attempts < 15)
      
      setTargetPosition(newPosition)
    }, 6000 + Math.random() * 4000) // Longer interval: 6-10 seconds

    return () => {
      clearInterval(interval)
      unregisterPosition(name)
    }
  }, [name, registerPosition, unregisterPosition, checkCollision])

  useFrame((_, delta) => {
    if (meshRef.current && isVisible) {
      // Reduce animation intensity when not in focus
      const intensity = document.hasFocus() ? 1 : 0.3
      currentPosition.current.lerp(targetPosition, 0.06 * intensity)
      meshRef.current.position.copy(currentPosition.current)
      meshRef.current.rotation.y += delta * 0.3 * intensity
      
      // Update position in collision manager
      updatePosition(name, currentPosition.current)
    }
  })

  return (
    <group ref={meshRef} position={initialPosition}>
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </group>
  )
}