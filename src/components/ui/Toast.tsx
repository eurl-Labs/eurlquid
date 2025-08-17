'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, AlertTriangle, Info, X, ExternalLink } from 'lucide-react'

interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  txHash?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  showToast: (toast: Omit<ToastNotification, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastItem({ toast, onRemove }: { toast: ToastNotification; onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-400" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-green-500/30'
      case 'error': return 'border-red-500/30'
      case 'warning': return 'border-yellow-500/30'
      case 'info': return 'border-blue-500/30'
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-500/10'
      case 'error': return 'bg-red-500/10'
      case 'warning': return 'bg-yellow-500/10'
      case 'info': return 'bg-blue-500/10'
    }
  }

  const openTxExplorer = () => {
    if (toast.txHash) {
      window.open(`https://explorer.soniclabs.com/tx/${toast.txHash}`, '_blank')
    }
  }

  return (
    <div className={`
      backdrop-blur-lg ${getBackgroundColor()} border ${getBorderColor()} 
      rounded-xl p-4 shadow-2xl transform transition-all duration-300 ease-out
      animate-in slide-in-from-right-full
      min-w-[400px] max-w-[500px]
    `}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold text-sm">{toast.title}</h4>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-white/80 text-sm mt-1 leading-relaxed">
            {toast.message}
          </p>
          
          {toast.txHash && (
            <div className="mt-3 flex items-center space-x-2">
              <div className="flex-1">
                <p className="text-white/60 text-xs">Transaction Hash:</p>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-white/80 text-xs font-mono bg-white/10 px-2 py-1 rounded">
                    {`${toast.txHash.slice(0, 8)}...${toast.txHash.slice(-8)}`}
                  </code>
                  <button
                    onClick={openTxExplorer}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/10"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => removeToast(newToast.id), newToast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const contextValue: ToastContextType = {
    showToast,
    removeToast
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-3">
          {toasts.map(toast => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}
