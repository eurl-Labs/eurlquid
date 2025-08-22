import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base } from 'viem/chains';
import { 
  rabbyWallet, 
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  braveWallet
} from '@rainbow-me/rainbowkit/wallets';
import { defineChain } from 'viem/chains/utils';
import { http } from 'wagmi';

export const sonicBlazeTestnet = defineChain({
  id: 57054,
  name: 'Sonic Blaze Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.blaze.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://explorer.blaze.soniclabs.com',
    },
  },
  testnet: true,
});

const getWalletConnectProjectId = () => {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId || projectId === 'default-project-id') {
    console.warn('⚠️ WalletConnect Project ID not found. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
    return '2f5e91765e9e8ac4e8e36a0b0e7c4c5b'; 
  }
  return projectId;
};

export const config = getDefaultConfig({
  appName: 'Eurlquid',
  projectId: getWalletConnectProjectId(),
  chains: [mainnet, arbitrum, base, sonicBlazeTestnet],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [  
        rabbyWallet,        
        walletConnectWallet,
      ],
    },
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sonicBlazeTestnet.id]: http('https://rpc.blaze.soniclabs.com', {
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  multiInjectedProviderDiscovery: false,
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
});