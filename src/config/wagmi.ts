import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base } from 'viem/chains';
import { 
  rabbyWallet, 
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  braveWallet
} from '@rainbow-me/rainbowkit/wallets';
import { defineChain } from 'viem/chains/utils';

// Define Sonic Blaze Testnet
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

// ✅ Custom wallet configuration dengan Rabby Wallet
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        rabbyWallet,      // ✅ Explicitly include Rabby Wallet
        metaMaskWallet,
        braveWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'Eurlquid',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  }
);

export const config = getDefaultConfig({
  appName: 'Eurlquid',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [mainnet, arbitrum, base, sonicBlazeTestnet],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        rabbyWallet,
        metaMaskWallet,
        braveWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  ssr: true,
});