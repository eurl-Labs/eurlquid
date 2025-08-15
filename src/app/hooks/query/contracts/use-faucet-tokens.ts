import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";

// Token configurations
export const FAUCET_TOKENS = {
  WSONIC: {
    name: "Wrapped Sonic",
    symbol: "WSONIC",
    address: "0x6e943f6BFb751512C68d7fB32dB4C3A51011656a" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/sonicLogo.png", // fallback
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F" as `0x${string}`,
    decimals: 18,
    amount: "100000", // 100k tokens
    logo: "/images/logoCoin/usdtLogo.png",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/usdcLogo.png",
  },
  WBTC: {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0xBBc467639fbEeDF5ec1eDFfC7Ed22b4666Cdd4bA" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/wbtcLogo.png",
  },
  WETH: {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    address: "0x0e07bce15e5Ae4729eE24b6294Aef7bcB6c2a260" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/ethLogo.png",
  },
  PEPE: {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6EB23CA35D4F467d0d2c326B1E23C8BFDF0688B4" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/pepeLogo.png",
  },
  PENGU: {
    name: "Pudgy Penguins",
    symbol: "PENGU",
    address: "0x894a84F584D4b84697854Ba0a895Eb122e8791A9" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/penguLogo.png",
  },
  POLLY: {
    name: "Polly",
    symbol: "POLLY",
    address: "0xFD9bd8cfc9f6326A1496f240E83ff6717f960E20" as `0x${string}`,
    decimals: 18,
    amount: "100000",
    logo: "/images/logoCoin/pollyLogo.jpg",
  },
  DARKPENGU: {
    name: "Dark Pengu",
    symbol: "DPENGU",
    address: "0x7DE89E03157F4866Ff5A4F04d3297e88C54bbdb8" as `0x${string}`,
    amount: "100000",
    decimals: 18,
    logo: "/images/logoCoin/darkPenguLogo.png",
  },
  GOONER: {
    name: "PURGY PENGOON",
    symbol: "GOONER",
    address: "0x92EeEd76021665B8D926069ecd9b5986c6c779fb" as `0x${string}`,
    amount: "100000",
    decimals: 18,
    logo: "/images/logoCoin/goonerLogo.png",
  },
    ABSTER: {
    name: "Abster",
    symbol: "ABSTER",
    address: "0xa989FAf5595228A42C701590515152c2aE0eaC39" as `0x${string}`,
    amount: "100000",
    decimals: 18,
    logo: "/images/logoCoin/absterLogo.jpg",
  },
} as const;

// ERC20 ABI with mint function
const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export type TokenSymbol = keyof typeof FAUCET_TOKENS;

interface UseFaucetReturn {
  claimToken: (tokenSymbol: TokenSymbol) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: `0x${string}` | undefined;
  reset: () => void;
}

export function useFaucet(): UseFaucetReturn {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    writeContract,
    data: txHash,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const claimToken = async (tokenSymbol: TokenSymbol) => {
    if (!address) {
      setError(new Error("Wallet not connected"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = FAUCET_TOKENS[tokenSymbol];
      const amount = parseEther(token.amount);

      await writeContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: "mint",
        args: [address, amount],
      });
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsLoading(false);
    resetWrite();
  };

  // Update loading state based on transaction status
  const finalIsLoading = isLoading || isConfirming;
  const finalError = error || writeError || receiptError;

  return {
    claimToken,
    isLoading: finalIsLoading,
    isSuccess,
    isError: !!finalError,
    error: finalError,
    txHash,
    reset,
  };
}
