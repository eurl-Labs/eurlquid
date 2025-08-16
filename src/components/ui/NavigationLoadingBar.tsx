'use client'

import { useNavigationLoading } from '@/contexts/NavigationLoadingContext'
import { motion, AnimatePresence } from 'framer-motion'

export function NavigationLoadingBar() {
  const { isLoading, loadingProgress } = useNavigationLoading()

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Top Loading Bar */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-white via-gray-300 to-white origin-left"
            style={{ 
              transform: `scaleX(${loadingProgress / 100})`,
              transformOrigin: 'left'
            }}
          />
          
          {/* Full Screen Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center min-h-screen">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-black border border-white/20 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Spinner */}
                  <div className="relative w-12 h-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full"
                    />
                  </div>
                  
                  {/* Loading Text */}
                  <div className="text-center">
                    <motion.h3 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-white font-medium mb-2"
                    >
                      Loading Page...
                    </motion.h3>
                    <motion.p 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-white/60 text-sm"
                    >
                      {Math.round(loadingProgress)}% Complete
                    </motion.p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-white via-gray-300 to-white rounded-full"
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}