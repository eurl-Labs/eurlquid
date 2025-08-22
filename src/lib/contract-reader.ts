import { createPublicClient, http } from "viem";
import { sonicBlazeTestnet } from "@/config/wagmi";
import { SWAP_ABI, getDexContractAddress } from "@/contracts/abi/swap-abi";

export const publicClient = createPublicClient({
  chain: sonicBlazeTestnet,
  transport: http("https://rpc.blaze.soniclabs.com"),
});

export async function getPoolIdFromContract(
  dexName: string,
  tokenA: string,
  tokenB: string
): Promise<string> {
  try {
    const contractAddress = getDexContractAddress(dexName);

    const poolId = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: SWAP_ABI,
      functionName: "getPoolId",
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
    });

    return poolId as string;
  } catch (error) {
    console.error("Failed to get pool ID from contract:", error);
    throw new Error(
      `Failed to get pool ID for ${tokenA}/${tokenB} on ${dexName}`
    );
  }
}

export async function validatePool(
  dexName: string,
  poolId: string
): Promise<{
  exists: boolean;
  tokenA: string;
  tokenB: string;
  reserveA: bigint;
  reserveB: bigint;
  totalSupply: bigint;
}> {
  try {
    const contractAddress = getDexContractAddress(dexName);

    const poolData = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: SWAP_ABI,
      functionName: "pools",
      args: [poolId as `0x${string}`],
    });

    const [tokenA, tokenB, reserveA, reserveB, totalSupply, exists] =
      poolData as [string, string, bigint, bigint, bigint, boolean];

    return {
      exists,
      tokenA,
      tokenB,
      reserveA,
      reserveB,
      totalSupply,
    };
  } catch (error) {
    console.error("Failed to validate pool:", error);
    throw new Error(`Failed to validate pool ${poolId} on ${dexName}`);
  }
}

export async function getSwapQuote(
  dexName: string,
  poolId: string,
  tokenIn: string,
  amountIn: bigint
): Promise<bigint> {
  try {
    const contractAddress = getDexContractAddress(dexName);

    const amountOut = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: SWAP_ABI,
      functionName: "getQuote",
      args: [poolId as `0x${string}`, tokenIn as `0x${string}`, amountIn],
    });

    return amountOut as bigint;
  } catch (error) {
    console.error("Failed to get swap quote:", error);
    throw new Error(
      `Failed to get quote for ${amountIn} ${tokenIn} on ${dexName}`
    );
  }
}

export async function getPoolReserves(
  dexName: string,
  poolId: string
): Promise<{ reserveA: bigint; reserveB: bigint }> {
  try {
    const contractAddress = getDexContractAddress(dexName);

    const reserves = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: SWAP_ABI,
      functionName: "getReserves",
      args: [poolId as `0x${string}`],
    });

    const [reserveA, reserveB] = reserves as [bigint, bigint];

    return { reserveA, reserveB };
  } catch (error) {
    console.error("Failed to get pool reserves:", error);
    throw new Error(`Failed to get reserves for pool ${poolId} on ${dexName}`);
  }
}

export async function getTokenAllowance(
  tokenAddress: string,
  owner: string,
  spender: string
): Promise<bigint> {
  try {
    const allowance = await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: [
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
      ],
      functionName: "allowance",
      args: [owner as `0x${string}`, spender as `0x${string}`],
    });

    return allowance as bigint;
  } catch (error) {
    console.error("Failed to get token allowance:", error);
    return BigInt(0);
  }
}

export async function getTokenBalance(
  tokenAddress: string,
  owner: string
): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: [
        {
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "balanceOf",
      args: [owner as `0x${string}`],
    });

    return balance as bigint;
  } catch (error) {
    console.error("Failed to get token balance:", error);
    return BigInt(0);
  }
}
