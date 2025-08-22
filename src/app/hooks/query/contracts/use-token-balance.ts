import { useReadContract, useAccount } from "wagmi";
import { POOL_TOKENS, type TokenSymbol } from "./use-pool";
import { formatEther } from "viem";
export type { TokenSymbol };

const ERC20_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface UseTokenBalanceReturn {
  balance: string;
  formattedBalance: string;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTokenBalance(
  tokenSymbol: TokenSymbol | null
): UseTokenBalanceReturn {
  const { address } = useAccount();

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: tokenSymbol ? POOL_TOKENS[tokenSymbol].address : undefined,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!tokenSymbol && !!address,
      refetchInterval: 30000,
      staleTime: 20000,
      refetchOnWindowFocus: false,
    },
  });

  const rawBalance = balance?.toString() || "0";
  const formattedBalance = formatEther(BigInt(rawBalance));

  return {
    balance: rawBalance,
    formattedBalance,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

interface UseMultipleTokenBalancesReturn {
  balances: Record<
    TokenSymbol,
    {
      balance: string;
      formattedBalance: string;
      isLoading: boolean;
      error: Error | null;
    }
  >;
  refetchAll: () => void;
}

export function useMultipleTokenBalances(
  tokens: TokenSymbol[]
): UseMultipleTokenBalancesReturn {
  const { address } = useAccount();

  const balanceQueries = tokens.map((tokenSymbol) => {
    const {
      data: balance,
      isLoading,
      error,
      refetch,
    } = useReadContract({
      address: POOL_TOKENS[tokenSymbol].address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
        refetchInterval: 30000,
        staleTime: 20000,
        refetchOnWindowFocus: false,
      },
    });

    const rawBalance = balance?.toString() || "0";
    const formattedBalance = formatEther(BigInt(rawBalance));

    return {
      tokenSymbol,
      balance: rawBalance,
      formattedBalance,
      isLoading,
      error: error as Error | null,
      refetch,
    };
  });

  const balances = balanceQueries.reduce(
    (acc, query) => {
      acc[query.tokenSymbol] = {
        balance: query.balance,
        formattedBalance: query.formattedBalance,
        isLoading: query.isLoading,
        error: query.error,
      };
      return acc;
    },
    {} as Record<
      TokenSymbol,
      {
        balance: string;
        formattedBalance: string;
        isLoading: boolean;
        error: Error | null;
      }
    >
  );

  const refetchAll = () => {
    balanceQueries.forEach((query) => query.refetch());
  };

  return {
    balances,
    refetchAll,
  };
}
