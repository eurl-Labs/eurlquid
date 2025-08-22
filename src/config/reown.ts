import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";

export const sonicBlazeTestnet = defineChain({
  id: 57054,
  name: "Sonic Blaze Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Sonic",
    symbol: "S",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.blaze.soniclabs.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Sonic Explorer",
      url: "https://explorer.blaze.soniclabs.com",
    },
  },
  testnet: true,
});

const getWalletConnectProjectId = () => {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId || projectId === "default-project-id") {
    console.warn(
      "⚠️ WalletConnect Project ID not found. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
    );
    return "2f5e91765e9e8ac4e8e36a0b0e7c4c5b";
  }
  return projectId;
};

const projectId = getWalletConnectProjectId();

const wagmiAdapter = new WagmiAdapter({
  networks: [sonicBlazeTestnet],
  projectId,
  ssr: true,
});

const metadata = {
  name: "Eurlquid",
  description: "Eurlquid - DeFi Platform on Sonic Network",
  url: "https://eurlquid.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sonicBlazeTestnet],
  defaultNetwork: sonicBlazeTestnet,
  metadata,
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#00D2FF",
    "--w3m-color-mix-strength": 20,
  },
  features: {
    analytics: true,
  },
});

export { wagmiAdapter };
export const config = wagmiAdapter.wagmiConfig;
