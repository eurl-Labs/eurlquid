'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationLoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined)

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const pathname = usePathname()

  // Auto-trigger loading on route changes
  useEffect(() => {
    setIsLoading(true)
    setLoadingProgress(10)

    // Simulate progressive loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 30
      })
    }, 100)

    // Complete loading after a short delay to allow for component mounting
    const completeTimer = setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setLoadingProgress(0)
      }, 200)
    }, 500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(completeTimer)
    }
  }, [pathname])

  return (
    <NavigationLoadingContext.Provider 
      value={{ 
        isLoading, 
        setIsLoading, 
        loadingProgress, 
        setLoadingProgress 
      }}
    >
      {children}
    </NavigationLoadingContext.Provider>
  )
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)
  if (context === undefined) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider')
  }
  return context
}