'use client';

import { useState, useMemo } from 'react';
import { Calendar, ExternalLink, Loader2, Filter, AlertCircle, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { SwapNavbar } from '@/components/swap/SwapNavbar';
import { Manrope } from 'next/font/google';
import Image from 'next/image';
import { useUserTradingHistory } from '@/hooks/useUserTradingHistory';
import { getTokenInfo, getDexInfo, formatTokenAmount } from '@/lib/token-mapping';
import { Swap } from '@/types/history';
import Link from 'next/link';

const manrope = Manrope({ subsets: ['latin'] });

export default function HistoryPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedDex, setSelectedDex] = useState('all');
  
  const { swaps, loading, error, refetch, refreshKey, isConnected, address } = useUserTradingHistory(selectedDex);

  // Debug: log swaps data to see actual token addresses
  console.log('Swaps data:', swaps);

  // Get unique DEX names from actual data
  const uniqueDexes = useMemo(() => {
    return Array.from(new Set(swaps.map(swap => swap.dex_name)));
  }, [swaps]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalSwaps = swaps.length;
    const volume = swaps.reduce((sum, swap) => {
      // Estimate USD value (simplified)
      const amountIn = parseFloat(formatTokenAmount(swap.amount_in));
      return sum + (amountIn * 100); // Rough estimation - needs real price data
    }, 0);
    
    return { totalSwaps, volume };
  }, [swaps]);

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const openTransaction = (txHash: string) => {
    window.open(`https://testnet.sonicscan.org/tx/${txHash}`, '_blank');
  };

  const getTokenDisplay = (tokenAddress: string) => {
    const tokenInfo = getTokenInfo(tokenAddress);
    
    if (tokenInfo) {
      return {
        symbol: tokenInfo.symbol,
        logo: tokenInfo.logo
      };
    }
    
    // Fallback for unknown tokens
    return {
      symbol: `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`,
      logo: '/images/logoCoin/defaultLogo.png'
    };
  };

  const getDexDisplay = (dexName: string) => {
    const dexInfo = getDexInfo(dexName);
    return {
      name: dexInfo?.name || dexName,
      logo: dexInfo?.logo || '/images/logo/defaultDex.png'
    };
  };

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className={`min-h-screen bg-black text-white ${manrope.className}`}>
        <SwapNavbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Wallet className="w-16 h-16 text-white/40 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-white/60 mb-8">
              Connect your wallet to view your transaction history
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white ${manrope.className}`}>
      <SwapNavbar />
      
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Transaction History</h1>
              <p className="text-white/60 mt-1">Your on-chain transaction records</p>
            </div>
            
            {/* Stats Bar */}
            <div className="flex space-x-6 overflow-x-auto pb-2">
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className="text-2xl font-bold text-white">{stats.totalSwaps}</div>
                <div className="text-white/60 text-sm">Total Swaps</div>
              </div>
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className="text-2xl font-bold text-white">${stats.volume.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Estimated Volume</div>
              </div>
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className="text-2xl font-bold text-white">{uniqueDexes.length}</div>
                <div className="text-white/60 text-sm">DEXs Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-white/60" />
                <div className="flex space-x-1">
                  {['all', ...uniqueDexes].map((dex) => (
                    <button
                      key={dex}
                      onClick={() => setSelectedDex(dex)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedDex === dex
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {dex === 'all' ? 'All DEXs' : dex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={() => refetch()}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
            >
              <motion.div
                animate={loading ? { rotate: 360 } : { rotate: 0 }}
                transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </motion.div>
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-red-400 font-medium">Error loading transaction history</p>
                <p className="text-red-400/80 text-sm">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-white/60">Loading transaction history...</p>
            </div>
          </div>
        )}

        {!loading && !error && swaps.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No transactions found</h3>
            <p className="text-white/60">
              {selectedDex === 'all' 
                ? "You haven't made any swaps yet. Start trading to see your history here!"
                : `No transactions found for ${selectedDex}. Try selecting a different DEX or clear the filter.`
              }
            </p>
          </div>
        )}

        {!loading && !error && swaps.length > 0 && (
          <motion.div 
            key={refreshKey} // Key berubah setiap kali refresh diklik
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/5 rounded-lg overflow-hidden border border-white/10"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Block Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Pair
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      DEX Aggregator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {swaps.map((swap: Swap, index) => {
                    const tokenIn = getTokenDisplay(swap.token_in);
                    const tokenOut = swap.token_out ? getTokenDisplay(swap.token_out) : null;
                    const dex = getDexDisplay(swap.dex_name);
                    
                    return (
                      <motion.tr 
                        key={swap.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 hover:underline">
                         <Link href={`https://testnet.sonicscan.org/block/${swap.block_number}`} target="_blank" rel="noopener noreferrer">
                           #{swap.block_number}
                         </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {formatDate(swap.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                                <Image
                                  src={tokenIn.logo}
                                  alt={`${tokenIn.symbol} logo`}
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span>{tokenIn.symbol}</span>
                            </div>
                            {tokenOut && (
                              <>
                                <span className="text-white/60">→</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                                    <Image
                                      src={tokenOut.logo}
                                      alt={`${tokenOut.symbol} logo`}
                                      width={24}
                                      height={24}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span>{tokenOut.symbol}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          <div>
                            <div className="font-medium">
                              {formatTokenAmount(swap.amount_in)} {tokenIn.symbol}
                            </div>
                            {swap.amount_out && tokenOut && (
                              <div className="text-xs text-white/40">
                                → {formatTokenAmount(swap.amount_out)} {tokenOut.symbol}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                              <Image
                                src={dex.logo}
                                alt={`${dex.name} logo`}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-white/80">{dex.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => openTransaction(swap.transaction_hash)}
                            className="cursor-pointer flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                          >
                            <span className="text-xs font-mono">{formatTxHash(swap.transaction_hash)}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}