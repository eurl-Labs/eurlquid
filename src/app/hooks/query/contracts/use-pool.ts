import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { readContract } from "wagmi/actions";
import { parseEther } from "viem";
import { useState } from "react";
import { config } from "../../../../config/reown";

export const DEX_AGGREGATORS = {
  Uniswap: {
    name: "Uniswap",
    address: "0x50D1672685E594B27F298Ac5bFACa4F3488AAA9c" as `0x${string}`,
    logo: "/images/logo/uniLogo.svg.png",
  },
  OneInch: {
    name: "1inch",
    address: "0xA9b3eD890229E575863514ef8464C0e6a771Bc58" as `0x${string}`,
    logo: "/images/logo/1inchLogo.png",
  },
  Curve: {
    name: "Curve",
    address: "0x03a6FE06D6C0C7c9726Ecd079cD9283A37b4c178" as `0x${string}`,
    logo: "/images/logo/curveLogo.png",
  },
  Balancer: {
    name: "Balancer",
    address: "0x2B778181dAB6Db356b00931a6c1833E1450f9655" as `0x${string}`,
    logo: "/images/logo/balancerLogo.png",
  },
} as const;

export const POOL_TOKENS = {
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/usdcLogo.png",
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xb13aF633516fe0d21BeB466C95fc34C3917BaAFb" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/usdtLogo.png",
  },
  WBTC: {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x395eAc2CE4fFFcd578652D689A0eeCC608649200" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/wbtcLogo.png",
  },
  WETH: {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    address: "0x931753b7A1141d23066fb7a0785ab5c2c1522F43" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/ethLogo.png",
  },
  WSONIC: {
    name: "Wrapped Sonic",
    symbol: "WSONIC",
    address: "0xb13aF633516fe0d21BeB466C95fc34C3917BaAFb" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/sonicLogo.png",
  },
  PEPE: {
    name: "Pepe",
    symbol: "PEPE",
    address: "0xeC4671DdD18f88eF7076124895cf42E067f3D4C5" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/pepeLogo.png",
  },
  PENGU: {
    name: "Pudgy Penguins",
    symbol: "PENGU",
    address: "0x2b026284561AF82CC015e61d2ecB5b7653f36190" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/penguLogo.png",
  },
  POLLY: {
    name: "Polly",
    symbol: "POLLY",
    address: "0xa83A7118481D3C5A2DDa8ac5F34c8b690Cb0a242" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/pollyLogo.jpg",
  },
  DARKPENGU: {
    name: "Dark Pengu",
    symbol: "DPENGU",
    address: "0x2b0b61AE71d390E8874cE405f05291DD405407ED" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/darkPenguLogo.png",
  },
  GOONER: {
    name: "PURGY PENGOON",
    symbol: "GOONER",
    address: "0x7cDaE08eFA988318feE67342a9CD06449D7651dB" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/goonerLogo.png",
  },
  ABSTER: {
    name: "Abster",
    symbol: "ABSTER",
    address: "0xc7251A2D1bcCF362F6D333977B2817710Aa71707" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/absterLogo.jpg",
  },
} as const;

export const EXISTING_POOLS = {
  "WBTC/USDT":
    "0xa2ccb2ebe696ef0f55e167981bfeaad4c2b1ea89e8d2e4587c156bbbb76ac179",
  "WETH/USDC":
    "0x82aad9f7e0caad402621ced7927878763830bbcae5e05f1ee5c6f4f9c1756ac7",
  "PEPE/USDT":
    "0x40c9d8c057660d4d4ed27d2fb020eb0a8cd165ebd088b1d9ae4170be499adb53",
  "WSONIC/PENGU":
    "0x9e4f549d4d845fe1cfa3fcfc16f002af3e0312233c6f63a4b5fd1cc0193bb719",
  "WETH/WSONIC":
    "0xba6ca351bb6feff4fff5031c7375c8402a404e82bc0d9bed27ed8dce594182cf",
  "WSONIC/PEPE":
    "0x0ff135a26b5398efd3e2249cff88214d219cd8d224b917af6984bbc91487bdcb",
} as const;

const MULTIPOOL_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "createPool",
    outputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [{ internalType: "uint256", name: "liquidity", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "getPoolId",
    outputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    name: "getReserves",
    outputs: [
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export type TokenSymbol = keyof typeof POOL_TOKENS;
export type DexName = keyof typeof DEX_AGGREGATORS;

interface UsePoolReturn {
  createPool: (
    tokenA: TokenSymbol,
    tokenB: TokenSymbol,
    dex: DexName
  ) => Promise<void>;

  addLiquidity: (
    poolId: string,
    amountA: string,
    amountB: string,
    tokenA: TokenSymbol,
    tokenB: TokenSymbol,
    dex: DexName
  ) => Promise<void>;

  approveToken: (
    tokenSymbol: TokenSymbol,
    amount: string,
    dex: DexName
  ) => Promise<void>;

  getPoolId: (
    tokenA: TokenSymbol,
    tokenB: TokenSymbol,
    dex: DexName
  ) => Promise<string | null>;

  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: `0x${string}` | undefined;
  reset: () => void;
}

export function usePool(): UsePoolReturn {
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

  const createPool = async (
    tokenA: TokenSymbol,
    tokenB: TokenSymbol,
    dex: DexName
  ) => {
    if (!address) {
      setError(new Error("Wallet not connected"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenAAddress = POOL_TOKENS[tokenA].address;
      const tokenBAddress = POOL_TOKENS[tokenB].address;
      const dexAddress = DEX_AGGREGATORS[dex].address;

      // console.log("Creating pool:", {
      //   tokenA,
      //   tokenB,
      //   dex,
      //   tokenAAddress,
      //   tokenBAddress,
      //   dexAddress,
      // });

      await writeContract({
        address: dexAddress,
        abi: MULTIPOOL_ABI,
        functionName: "createPool",
        args: [tokenAAddress, tokenBAddress],
      });
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const addLiquidity = async (
    poolId: string,
    amountA: string,
    amountB: string,
    tokenA: TokenSymbol,
    tokenB: TokenSymbol,
    dex: DexName
  ) => {
    if (!address) {
      setError(new Error("Wallet not connected"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmountA = parseEther(amountA);
      const parsedAmountB = parseEther(amountB);
      const dexAddress = DEX_AGGREGATORS[dex].address;
      const tokenAAddress = POOL_TOKENS[tokenA].address;
      const tokenBAddress = POOL_TOKENS[tokenB].address;

      try {
        const contractPoolId = await readContract(config, {
          address: dexAddress,
          abi: MULTIPOOL_ABI,
          functionName: "getPoolId",
          args: [tokenAAddress, tokenBAddress],
        });

        if (contractPoolId !== poolId) {
          throw new Error(
            `Pool ID mismatch! Contract: ${contractPoolId}, Using: ${poolId}`
          );
        }
      } catch (poolError: any) {
        console.error("❌ Pool ID verification failed:", poolError);
        throw new Error(
          `Pool verification failed: ${poolError.message || poolError}`
        );
      }

      try {
        const [allowanceA, allowanceB] = await Promise.all([
          readContract(config, {
            address: tokenAAddress,
            abi: ERC20_ABI,
            functionName: "allowance",
            args: [address!, dexAddress],
          }),
          readContract(config, {
            address: tokenBAddress,
            abi: ERC20_ABI,
            functionName: "allowance",
            args: [address!, dexAddress],
          }),
        ]);

        if (BigInt(allowanceA.toString()) < parsedAmountA) {
          throw new Error(
            `Insufficient ${tokenA} approval. Have: ${allowanceA.toString()}, Need: ${parsedAmountA.toString()}`
          );
        }

        if (BigInt(allowanceB.toString()) < parsedAmountB) {
          throw new Error(
            `Insufficient ${tokenB} approval. Have: ${allowanceB.toString()}, Need: ${parsedAmountB.toString()}`
          );
        }
      } catch (approvalError: any) {
        console.error("❌ Token approval check failed:", approvalError);
        throw new Error(
          `Token approval validation failed: ${
            approvalError.message || approvalError
          }`
        );
      }

      try {
        const [balanceA, balanceB] = await Promise.all([
          readContract(config, {
            address: tokenAAddress,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address!],
          }),
          readContract(config, {
            address: tokenBAddress,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address!],
          }),
        ]);

        if (BigInt(balanceA.toString()) < parsedAmountA) {
          throw new Error(
            `Insufficient ${tokenA} balance. Have: ${balanceA.toString()}, Need: ${parsedAmountA.toString()}`
          );
        }

        if (BigInt(balanceB.toString()) < parsedAmountB) {
          throw new Error(
            `Insufficient ${tokenB} balance. Have: ${balanceB.toString()}, Need: ${parsedAmountB.toString()}`
          );
        }
      } catch (balanceError: any) {
        console.error("❌ Token balance check failed:", balanceError);
        throw new Error(
          `Token balance validation failed: ${
            balanceError.message || balanceError
          }`
        );
      }

      try {
        const contractPoolIdCheck = await readContract(config, {
          address: dexAddress,
          abi: MULTIPOOL_ABI,
          functionName: "getPoolId",
          args: [tokenAAddress, tokenBAddress],
        });

        if (
          !contractPoolIdCheck ||
          contractPoolIdCheck ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          throw new Error(
            `❌ CRITICAL: Pool does not exist in smart contract! Pool for ${tokenA}/${tokenB} must be created first before adding liquidity.`
          );
        }

        if (contractPoolIdCheck !== poolId) {
          console.warn("⚠️ Pool ID mismatch detected:");
          console.warn("   Contract says:", contractPoolIdCheck);
          console.warn("   We are using:", poolId);
          throw new Error(
            `Pool ID mismatch! Contract: ${contractPoolIdCheck}, Using: ${poolId}`
          );
        }
      } catch (emergencyError: any) {
        console.error(
          "❌ EMERGENCY: Pool existence check failed:",
          emergencyError
        );
        throw new Error(
          `Pool existence verification failed: ${
            emergencyError.message || emergencyError
          }`
        );
      }

      await writeContract({
        address: dexAddress,
        abi: MULTIPOOL_ABI,
        functionName: "addLiquidity",
        args: [poolId as `0x${string}`, parsedAmountA, parsedAmountB],
      });
    } catch (err) {
      console.error("❌ Add Liquidity Failed:", err);
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const approveToken = async (
    tokenSymbol: TokenSymbol,
    amount: string,
    dex: DexName
  ) => {
    if (!address) {
      setError(new Error("Wallet not connected"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenAddress = POOL_TOKENS[tokenSymbol].address;
      const dexAddress = DEX_AGGREGATORS[dex].address;
      const parsedAmount = parseEther(amount);

      await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [dexAddress, parsedAmount],
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

  const getPoolId = async (
    tokenA: TokenSymbol,
    tokenB: TokenSymbol,
    dex: DexName
  ): Promise<string | null> => {
    try {
      const tokenAAddress = POOL_TOKENS[tokenA].address;
      const tokenBAddress = POOL_TOKENS[tokenB].address;
      const dexAddress = DEX_AGGREGATORS[dex].address;

      console.log("🔍 Getting Pool ID from smart contract:", {
        tokenA: `${tokenA} (${tokenAAddress})`,
        tokenB: `${tokenB} (${tokenBAddress})`,
        dex: `${dex} (${dexAddress})`,
      });

      const poolId = await readContract(config, {
        address: dexAddress,
        abi: MULTIPOOL_ABI,
        functionName: "getPoolId",
        args: [tokenAAddress, tokenBAddress],
      });

      if (poolId) {
        return poolId as string;
      }

      throw new Error("Pool ID not found");
    } catch (error) {
      console.error("❌ Failed to get pool ID from smart contract:", error);

      const poolKey = `${tokenA}/${tokenB}` as keyof typeof EXISTING_POOLS;
      const reversePoolKey =
        `${tokenB}/${tokenA}` as keyof typeof EXISTING_POOLS;
      const knownPoolId =
        EXISTING_POOLS[poolKey] || EXISTING_POOLS[reversePoolKey];

      if (knownPoolId) {
        return knownPoolId;
      }

      console.error("❌ No pool ID found in smart contract or existing pools");
      return null;
    }
  };

  const finalIsLoading = isLoading || isConfirming;
  const finalError = error || writeError || receiptError;

  return {
    createPool,
    addLiquidity,
    approveToken,
    getPoolId,
    isLoading: finalIsLoading,
    isSuccess,
    isError: !!finalError,
    error: finalError,
    txHash,
    reset,
  };
}
