'use client';

import { useState } from 'react';
import { ChevronDown, Clock, TrendingUp, TrendingDown, CheckCircle, XCircle, Loader2, Filter, Calendar, ExternalLink } from 'lucide-react';
import { SwapNavbar } from '@/components/swap/SwapNavbar';
import { Manrope } from 'next/font/google';
import Image from 'next/image';

const manrope = Manrope({ subsets: ['latin'] });

// Mock data for demonstration with DEX aggregators
const mockHistoryData = [
  {
    id: 1,
    date: '2024-01-15T10:30:00Z',
    pair: 'ETH/USDC',
    amount: '2.5 ETH',
    value: '$4,250.00',
    slippage: 0.15,
    dexAggregator: '1inch',
    dexLogo: '/images/logo/1inchLogo.png',
    status: 'success',
    profitLoss: 12.50,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: 2,
    date: '2024-01-14T15:45:00Z',
    pair: 'USDC/ETH',
    amount: '1,000 USDC',
    value: '$1,000.00',
    slippage: -0.08,
    dexAggregator: 'Uniswap',
    dexLogo: '/images/logo/uniLogo.svg.png',
    status: 'success',
    profitLoss: -5.20,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: 3,
    date: '2024-01-13T09:20:00Z',
    pair: 'WBTC/ETH',
    amount: '0.1 WBTC',
    value: '$3,200.00',
    slippage: 0.25,
    dexAggregator: 'Curve',
    dexLogo: '/images/logo/curveLogo.png',
    status: 'failed',
    profitLoss: 0,
    txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba'
  },
  {
    id: 4,
    date: '2024-01-12T14:10:00Z',
    pair: 'ETH/USDT',
    amount: '1.8 ETH',
    value: '$3,060.00',
    slippage: 0.12,
    dexAggregator: 'Balancer',
    dexLogo: '/images/logo/balancerLogo.png',
    status: 'pending',
    profitLoss: 0,
    txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
  },
  {
    id: 5,
    date: '2024-01-11T11:20:00Z',
    pair: 'USDC/USDT',
    amount: '5,000 USDC',
    value: '$5,000.00',
    slippage: 0.05,
    dexAggregator: 'SushiSwap',
    dexLogo: '/images/logo/sushiLogo.png',
    status: 'success',
    profitLoss: 8.75,
    txHash: '0x5555555555555555555555555555555555555555555555555555555555555555'
  },
  {
    id: 6,
    date: '2024-01-10T16:30:00Z',
    pair: 'ETH/DAI',
    amount: '3.2 ETH',
    value: '$5,440.00',
    slippage: 0.18,
    dexAggregator: 'Matcha',
    dexLogo: '/images/logo/matchaLogo.png',
    status: 'success',
    profitLoss: -2.10,
    txHash: '0x6666666666666666666666666666666666666666666666666666666666666666'
  }
];

// Calculate stats
const calculateStats = (data: typeof mockHistoryData) => {
  const totalSwaps = data.length;
  const volume = data.reduce((sum, item) => sum + parseFloat(item.value.replace('$', '').replace(',', '')), 0);
  const netProfit = data.reduce((sum, item) => sum + item.profitLoss, 0);
  const successRate = (data.filter(item => item.status === 'success').length / totalSwaps) * 100;

  return { totalSwaps, volume, netProfit, successRate };
};

const stats = calculateStats(mockHistoryData);

export default function HistoryPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedDex, setSelectedDex] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  const getProfitLossColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const getSlippageColor = (value: number) => {
    if (value > 0.2) return 'text-red-500';
    if (value > 0.1) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const openTransaction = (txHash: string) => {
    // Open transaction in Etherscan or similar block explorer
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  // Get unique DEX aggregators for filter
  const uniqueDexes = Array.from(new Set(mockHistoryData.map(item => item.dexAggregator)));

  return (
    <div className={`min-h-screen bg-black text-white ${manrope.className}`}>
      <SwapNavbar />
      
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Swap History</h1>
              <p className="text-white/60 mt-1">Your transaction records</p>
            </div>
            
            {/* Stats Bar */}
            <div className="flex space-x-6 overflow-x-auto pb-2">
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className="text-2xl font-bold text-white">{stats.totalSwaps}</div>
                <div className="text-white/60 text-sm">Total Swaps</div>
              </div>
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className="text-2xl font-bold text-white">${stats.volume.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Volume</div>
              </div>
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className={`text-2xl font-bold ${getProfitLossColor(stats.netProfit)}`}>
                  ${stats.netProfit.toFixed(2)}
                </div>
                <div className="text-white/60 text-sm">Net Profit</div>
              </div>
              <div className="flex-shrink-0 bg-white/5 rounded-lg p-4 min-w-[150px] border border-white/10">
                <div className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</div>
                <div className="text-white/60 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            
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

            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {['all', 'success', 'failed', 'pending'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Pair</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Slippage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">DEX Aggregator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Profit/Loss</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mockHistoryData.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {item.pair}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      <div>{item.amount}</div>
                      <div className="text-xs text-white/40">{item.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${getSlippageColor(item.slippage)}`}>
                        {item.slippage > 0 ? '+' : ''}{item.slippage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                          <Image
                            src={item.dexLogo}
                            alt={`${item.dexAggregator} logo`}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white/80">{item.dexAggregator}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <span className={`capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${getProfitLossColor(item.profitLoss)}`}>
                        {item.profitLoss > 0 ? '+' : ''}${item.profitLoss.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTransaction(item.txHash);
                        }}
                        className="flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <span className="text-xs font-mono">{formatTxHash(item.txHash)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 