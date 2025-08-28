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

export const sonicMainnet = defineChain({
  id: 57054,
  name: 'Sonic',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://sonicscan.org',
    },
  },
  testnet: false,
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
  chains: [mainnet, arbitrum, base, sonicMainnet],
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
    [sonicMainnet.id]: http('https://rpc.soniclabs.com', {
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