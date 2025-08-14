'use client';

import { ReactNode, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import { WalletConnectionHandler } from '@/components/wallet/WalletConnectionHandler';

import '@rainbow-me/rainbowkit/styles.css';

// ✅ Enhanced: Create QueryClient with better error handling
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on connection errors
          if (error?.message?.includes('Connection interrupted') || 
              error?.message?.includes('WebSocket connection closed')) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let clientSingleton: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientSingleton) clientSingleton = makeQueryClient();
    return clientSingleton;
  }
}

interface WalletProvidersProps {
  children: ReactNode;
}

export function WalletProviders({ children }: WalletProvidersProps) {
  // ✅ Enhanced: Use singleton QueryClient with proper error handling
  const queryClient = getQueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#ffffff',
            accentColorForeground: '#000000',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
          // ✅ Enhanced: Add connection retry options
          showRecentTransactions={true}
          coolMode={false}
        >
          <WalletConnectionHandler>
            {children}
          </WalletConnectionHandler>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}