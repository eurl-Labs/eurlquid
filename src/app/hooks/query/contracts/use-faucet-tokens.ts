import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";

export const FAUCET_TOKENS = {
  // WSONIC: {
  //   name: "Wrapped Sonic",
  //   symbol: "WSONIC",
  //   address: "0xb13aF633516fe0d21BeB466C95fc34C3917BaAFb" as `0x${string}`,
  //   decimals: 18,
  //   amount: "100000",
  //   logo: "/images/logoCoin/sonicLogo.png",
  // },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xb13aF633516fe0d21BeB466C95fc34C3917BaAFb" as `0x${string}`,
    decimals: 18,
    amount: "100000",
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
  // WBTC: {
  //   name: "Wrapped Bitcoin",
  //   symbol: "WBTC",
  //   address: "0x395eAc2CE4fFFcd578652D689A0eeCC608649200" as `0x${string}`,
  //   decimals: 18,
  //   amount: "100000",
  //   logo: "/images/logoCoin/wbtcLogo.png",
  // },
  // WETH: {
  //   name: "Wrapped Ethereum",
  //   symbol: "WETH",
  //   address: "0x931753b7A1141d23066fb7a0785ab5c2c1522F43" as `0x${string}`,
  //   decimals: 18,
  //   amount: "100000",
  //   logo: "/images/logoCoin/ethLogo.png",
  // },
  // PEPE: {
  //   name: "Pepe",
  //   symbol: "PEPE",
  //   address: "0xeC4671DdD18f88eF7076124895cf42E067f3D4C5" as `0x${string}`,
  //   decimals: 18,
  //   amount: "100000",
  //   logo: "/images/logoCoin/pepeLogo.png",
  // },
  // PENGU: {
  //   name: "Pudgy Penguins",
  //   symbol: "PENGU",
  //   address: "0x2b026284561AF82CC015e61d2ecB5b7653f36190" as `0x${string}`,
  //   decimals: 18,
  //   amount: "100000",
  //   logo: "/images/logoCoin/penguLogo.png",
  // },
  // POLLY: {
  //   name: "Polly",
  //   symbol: "POLLY",
  //   address: "0xa83A7118481D3C5A2DDa8ac5F34c8b690Cb0a242" as `0x${string}`,
  //   decimals: 18,
  //   amount: "100000",
  //   logo: "/images/logoCoin/pollyLogo.jpg",
  // },
  // DARKPENGU: {
  //   name: "Dark Pengu",
  //   symbol: "DPENGU",
  //   address: "0x2b0b61AE71d390E8874cE405f05291DD405407ED" as `0x${string}`,
  //   amount: "100000",
  //   decimals: 18,
  //   logo: "/images/logoCoin/darkPenguLogo.png",
  // },
  GOONER: {
    name: "PURGY PENGOON",
    symbol: "GOONER",
    address: "0x7cDaE08eFA988318feE67342a9CD06449D7651dB" as `0x${string}`,
    amount: "100000",
    decimals: 18,
    logo: "/images/logoCoin/goonerLogo.png",
  },
  // ABSTER: {
  //   name: "Abster",
  //   symbol: "ABSTER",
  //   address: "0xc7251A2D1bcCF362F6D333977B2817710Aa71707" as `0x${string}`,
  //   amount: "100000",
  //   decimals: 18,
  //   logo: "/images/logoCoin/absterLogo.jpg",
  // },
} as const;

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
