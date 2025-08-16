'use client'

import { Suspense, useEffect, useState } from 'react'
import { Scene } from './Scene'

export function LazyScene() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Delay 3D scene loading until after initial render
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 1000) // Load scene after 1 second

    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) {
    return null // Return nothing until ready to load
  }

  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  )
}