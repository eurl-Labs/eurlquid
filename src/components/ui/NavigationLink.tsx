'use client'

import Link from 'next/link'
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
  const { setIsLoading } = useNavigationLoading()
  const pathname = usePathname()

  const handleClick = () => {
    // Only trigger loading if navigating to a different page
    if (pathname !== href) {
      setIsLoading(true)
    }
    onClick?.()
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}