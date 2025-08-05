import React from 'react';
import { InfiniteScroll } from './';
import Image from 'next/image';
import { BlurText } from '@/components/ui';

const dexLogos = [
  { name: 'Uniswap', src: '/images/logo/uniLogo.svg.png', color: '#FF007A' },
  { name: 'SushiSwap', src: '/images/logo/sushiLogo.png', color: '#FA52A0' },
  { name: '1inch', src: '/images/logo/1inchLogo.png', color: '#1F2937' },
  { name: 'Curve', src: '/images/logo/curveLogo.png', color: '#FF6B35' },
  { name: 'Balancer', src: '/images/logo/balancerLogo.png', color: '#536DFE' },
  { name: 'Matcha', src: '/images/logo/matchaLogo.png', color: '#00D395' },
  { name: 'Odos', src: '/images/logo/odosLogo.png', color: '#6966FF' },
  { name: 'Orca', src: '/images/logo/orcaLogo.png', color: '#B6509E' },
  { name: 'SilverSwap', src: '/images/logo/silverswapLogo.png', color: '#31CB9E' },
  { name: 'IceCreamSwap', src: '/images/logo/icecreamswapLogo.ico', color: '#FF6B9D' },
];

const DexCard = ({ name, src, color }: { name: string; src: string; color: string }) => (
  <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-4 sm:p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 min-w-[160px] sm:min-w-[200px]">
    <div className="flex items-center justify-center mb-3 sm:mb-4">
      <div 
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center p-2"
        style={{ backgroundColor: `${color}20` }}
      >
        <Image
          src={src}
          alt={name}
          width={32}
          height={32}
          className="object-contain sm:w-10 sm:h-10"
        />
      </div>
    </div>
    <h3 className="text-white text-base sm:text-lg font-semibold text-center mb-1 sm:mb-2">{name}</h3>
    <p className="text-gray-400 text-xs sm:text-sm text-center">DEX Aggregator</p>
  </div>
);

const DexScrollSection: React.FC = () => {
  const scrollItems = dexLogos.map((dex, index) => ({
    content: <DexCard key={index} {...dex} />
  }));

  return (
    <section className="w-full bg-black py-12 sm:py-20 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-7xl mx-auto px-4">
          <div className="relative hidden lg:block">
            <InfiniteScroll
              width="250px"
              maxHeight="500px"
              items={scrollItems}
              itemMinHeight={180}
              autoplay={true}
              autoplaySpeed={1}
              autoplayDirection="up"
              pauseOnHover={true}
              isTilted={false}
              tiltDirection="left"
            />
          </div>
          
          <div className="flex flex-col items-center justify-center px-4 sm:px-8 w-full lg:min-w-[400px] lg:max-w-[500px]">
            <BlurText
              text="Seamless cross-chain swaps with zero slippage tolerance"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-xl sm:text-2xl lg:text-2xl font-bold text-white text-center mb-4"
            />
            <BlurText
              text="Experience lightning-fast transactions across 20+ blockchain networks with institutional-grade security and transparency"
              delay={200}
              animateBy="words"
              direction="bottom"
              className="text-sm sm:text-base text-gray-300 text-center leading-relaxed"
            />
          </div>

          <div className="relative hidden lg:block">
            <InfiniteScroll
              width="250px"
              maxHeight="500px"
              items={scrollItems.slice().reverse()}
              itemMinHeight={180}
              autoplay={true}
              autoplaySpeed={0.8}
              autoplayDirection="down"
              pauseOnHover={true}
              isTilted={false}
              tiltDirection="right"
            />
          </div>
        </div>
        
        {/* Mobile horizontal scroll */}
        <div className="lg:hidden w-full mt-8 overflow-x-auto">
          <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
            {dexLogos.slice(0, 6).map((dex, index) => (
              <DexCard key={index} {...dex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DexScrollSection;