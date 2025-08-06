'use client'

import Beams from '@/components/ui/Beams'
import { PlayCircle, MessageCircle, Code } from 'lucide-react'

export function SwapSmartSection() {
  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden font-manrope">
      {/* Beams Background */}
      <div className="absolute inset-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading with improved typography */}
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Curious how to swap
            <br />
            <span className="text-white">
              smarter?
            </span>
          </h1>
          
          {/* Subtitle with better spacing */}
          <p className="text-[clamp(1.125rem,2.5vw,1.5rem)] text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
            See our demo video project.
          </p>
          
          {/* Action Buttons with icons and improved design */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold text-lg rounded-lg hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl min-w-[180px]">
              <PlayCircle className="w-5 h-5" />
              <span>View Demo</span>
            </button>
          </div>
          
        </div>
      </div>
    </section>
  )
}