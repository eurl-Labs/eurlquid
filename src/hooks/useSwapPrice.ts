import { useState, useEffect } from 'react';
import { calculateSwapRate, getTokenPriceUSD } from '@/lib/pyth-price';

interface UseSwapPriceResult {
  toAmount: string;
  fromPriceUSD: number | null;
  toPriceUSD: number | null;
  isLoading: boolean;
  error: string | null;
  fromValueUSD: number | null;
  toValueUSD: number | null;
}

export function useSwapPrice(
  fromToken: string,
  toToken: string, 
  fromAmount: string
): UseSwapPriceResult {
  const [toAmount, setToAmount] = useState<string>("0");
  const [fromPriceUSD, setFromPriceUSD] = useState<number | null>(null);
  const [toPriceUSD, setToPriceUSD] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount || fromAmount === "0" || fromAmount === "") {
      setToAmount("0");
      setFromPriceUSD(null);
      setToPriceUSD(null);
      setError(null);
      return;
    }

    const fetchPrices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fromAmountNum = parseFloat(fromAmount);
        if (isNaN(fromAmountNum) || fromAmountNum <= 0) {
          setToAmount("0");
          return;
        }

        console.log(`Fetching prices for ${fromToken} -> ${toToken}, amount: ${fromAmountNum}`);
        
        const result = await calculateSwapRate(fromToken, toToken, fromAmountNum);
        
        console.log(`Price calculation result:`, {
          fromToken,
          toToken,
          fromAmountNum,
          fromPriceUSD: result.fromPriceUSD,
          toPriceUSD: result.toPriceUSD,
          toAmount: result.toAmount
        });

        setFromPriceUSD(result.fromPriceUSD);
        setToPriceUSD(result.toPriceUSD);
        setToAmount(result.toAmount.toFixed(6));
        
      } catch (err) {
        console.error("Error fetching swap prices:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch prices");
        setToAmount("0");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API calls
    const timeoutId = setTimeout(fetchPrices, 500);
    
    return () => clearTimeout(timeoutId);
  }, [fromToken, toToken, fromAmount]);

  // Calculate USD values
  const fromValueUSD = fromPriceUSD && fromAmount ? fromPriceUSD * parseFloat(fromAmount) : null;
  const toValueUSD = toPriceUSD && toAmount ? toPriceUSD * parseFloat(toAmount) : null;

  return {
    toAmount,
    fromPriceUSD,
    toPriceUSD,
    isLoading,
    error,
    fromValueUSD,
    toValueUSD
  };
}
