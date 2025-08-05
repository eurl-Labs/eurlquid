import React from 'react';
import { ChromaGrid, ChromaItem } from './';
import Image from 'next/image';

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
    <section className="w-full bg-black py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,122,0.1),transparent)]"></div>
      
      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-5xl p-10 font-bold text-white">
            Powered by Popular Dex Aggregator
          </h2>
        </div>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
          Experience the most liquid and efficient decentralized trading ecosystem. 
          Connect with Uniswap's revolutionary AMM technology and discover why millions trust us for DeFi.
        </p>
      </div>

      <div className="relative" style={{ height: '600px' }}>
        <ChromaGrid 
          items={uniswapItems}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>

      <div className="text-center relative z-10">
        <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Trade with Confidence
        </h3>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join the decentralized revolution. Every swap, every trade, every transaction - 
          powered by the most trusted protocols in DeFi.
        </p>
        <div className="mt-8">
          <button className="bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/25 border-2 border-gray-300 hover:border-gray-400">
            Start Trading Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default UniswapShowcase;