import React from 'react';
import { ChromaGrid, ChromaItem } from './';
import Image from 'next/image';
import Link from 'next/link';
const UniswapShowcase: React.FC = () => {
  const uniswapItems: ChromaItem[] = [
    {
      image: "/images/logo/uniLogo.svg.png",
      title: "Uniswap V4 Ready",
      subtitle: "Next-gen AMM with hooks",
      handle: "@uniswap",
      borderColor: "#FF007A",
      gradient: "linear-gradient(145deg, #FF007A, #000)",
      url: "https://uniswap.org"
    },
    {
      image: "/images/logo/1inchLogo.png",
      title: "1inch Fusion",
      subtitle: "Gasless swaps",
      handle: "@1inch",
      borderColor: "#1F2937",
      gradient: "linear-gradient(180deg, #1F2937, #000)",
      url: "https://1inch.io"
    },
    {
      image: "/images/logo/sushiLogo.png",
      title: "SushiSwap V3",
      subtitle: "Community-driven DEX",
      handle: "@sushiswap",
      borderColor: "#FA52A0",
      gradient: "linear-gradient(165deg, #FA52A0, #000)",
      url: "https://sushi.com"
    },
    {
      image: "/images/logo/curveLogo.png",
      title: "Curve Finance",
      subtitle: "Stable & efficient trades",
      handle: "@curvefinance",
      borderColor: "#FF6B35",
      gradient: "linear-gradient(195deg, #FF6B35, #000)",
      url: "https://curve.fi"
    },
    {
      image: "/images/logo/balancerLogo.png",
      title: "Balancer V3",
      subtitle: "Multi-asset AMM",
      handle: "@balancer",
      borderColor: "#536DFE",
      gradient: "linear-gradient(225deg, #536DFE, #000)",
      url: "https://balancer.fi"
    },
  ];

  return (
    <section className="w-full bg-black py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,122,0.1),transparent)]"></div>
      
      <div className="container mx-auto px-4 text-center mb-6 sm:mb-12 md:mb-16 relative z-10">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 font-bold text-white leading-tight">
            Powered by Popular Dex Aggregator
          </h2>
        </div>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2">
          Experience the most liquid and efficient decentralized trading ecosystem. 
          Connect with Uniswap's revolutionary AMM technology and discover why millions trust us for DeFi.
        </p>
      </div>

      {/* Mobile: Show static grid of DEX cards */}
      <div className="block sm:hidden mb-8">
        <div className="grid grid-cols-2 gap-3 px-4 max-w-sm mx-auto">
          {uniswapItems.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-3 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center p-1"
                  style={{ backgroundColor: `${item.borderColor}20` }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </div>
              <h4 className="text-white text-xs font-semibold text-center mb-1">{item.title}</h4>
              <p className="text-gray-400 text-xs text-center">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet and Desktop: ChromaGrid */}
      <div className="relative px-4 sm:px-0 hidden sm:block">
        <div className="sm:block md:hidden" style={{ height: '400px', minHeight: '400px' }}>
          <ChromaGrid 
            items={uniswapItems}
            radius={200}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>
        <div className="hidden md:block" style={{ height: '500px', minHeight: '500px' }}>
          <ChromaGrid 
            items={uniswapItems}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>
      </div>

      <div className="text-center relative z-10 px-4 mt-8 sm:mt-12 md:mt-16">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
          Trade with Confidence
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto px-2 leading-relaxed mb-4 sm:mb-6 md:mb-8">
          Join the decentralized revolution. Every swap, every trade, every transaction - 
          powered by the most trusted protocols in DeFi.
        </p>
        <div className="mt-4 sm:mt-6 md:mt-8">
          <button className="bg-white hover:bg-gray-100 text-black font-bold py-2.5 sm:py-3 md:py-4 px-5 sm:px-6 md:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/25 border-2 border-gray-300 hover:border-gray-400 text-xs sm:text-sm md:text-base w-full sm:w-auto max-w-xs sm:max-w-none">
           <Link href='/swap'>
           Start Trading Now
           </Link> 
          </button>
        </div>
      </div>
    </section>
  );
};

export default UniswapShowcase;