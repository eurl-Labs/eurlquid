'use client'

import { createContext, useContext, useState, useRef, ReactNode } from 'react'
import * as THREE from 'three'

interface CollisionContextType {
  positions: Map<string, THREE.Vector3>
  registerPosition: (id: string, position: THREE.Vector3) => void
  unregisterPosition: (id: string) => void
  checkCollision: (id: string, newPosition: THREE.Vector3, minDistance?: number) => boolean
  updatePosition: (id: string, position: THREE.Vector3) => void
}

const CollisionContext = createContext<CollisionContextType | null>(null)

export function CollisionProvider({ children }: { children: ReactNode }) {
  const positions = useRef<Map<string, THREE.Vector3>>(new Map())

  const registerPosition = (id: string, position: THREE.Vector3) => {
    positions.current.set(id, position.clone())
  }

  const unregisterPosition = (id: string) => {
    positions.current.delete(id)
  }

  const checkCollision = (id: string, newPosition: THREE.Vector3, minDistance: number = 3.5) => {
    for (const [otherId, otherPos] of positions.current.entries()) {
      if (otherId !== id && newPosition.distanceTo(otherPos) < minDistance) {
        return true
      }
    }
    return false
  }

  const updatePosition = (id: string, position: THREE.Vector3) => {
    if (positions.current.has(id)) {
      positions.current.get(id)!.copy(position)
    }
  }

  return (
    <CollisionContext.Provider value={{
      positions: positions.current,
      registerPosition,
      unregisterPosition,
      checkCollision,
      updatePosition
    }}>
      {children}
    </CollisionContext.Provider>
  )
}

export function useCollision() {
  const context = useContext(CollisionContext)
  if (!context) {
    throw new Error('useCollision must be used within CollisionProvider')
  }
  return context
}