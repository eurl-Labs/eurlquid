'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface WalletConnectionHandlerProps {
  children: ReactNode;
}

export function WalletConnectionHandler({ children }: WalletConnectionHandlerProps) {
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  const { connectors, connect, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  // ✅ Enhanced: Handle connection errors with retry logic
  useEffect(() => {
    if (connectError) {
      const errorMessage = connectError.message;
      console.error('🔴 Wallet connection error:', errorMessage);
      
      // Handle specific error types
      if (errorMessage.includes('Connection interrupted while trying to subscribe') ||
          errorMessage.includes('WebSocket connection closed') ||
          errorMessage.includes('Network request failed')) {
        
        setLastError(errorMessage);
        
        // Retry connection with exponential backoff
        if (connectionAttempts < 3) {
          const retryDelay = Math.min(1000 * Math.pow(2, connectionAttempts), 5000);
          console.log(`🔄 Retrying connection in ${retryDelay}ms... (attempt ${connectionAttempts + 1}/3)`);
          
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            // Try to reconnect with the first available connector
            const preferredConnector = connectors.find(c => c.name === 'MetaMask') || connectors[0];
            if (preferredConnector) {
              connect({ connector: preferredConnector });
            }
          }, retryDelay);
        } else {
          console.error('❌ Max connection attempts reached. Please try manually.');
          // Reset after 10 seconds
          setTimeout(() => {
            setConnectionAttempts(0);
            setLastError(null);
          }, 10000);
        }
      }
    }
  }, [connectError, connectionAttempts, connectors, connect]);

  // ✅ Enhanced: Reset connection attempts on successful connection
  useEffect(() => {
    if (isConnected) {
      setConnectionAttempts(0);
      setLastError(null);
      console.log('✅ Wallet connected successfully');
    }
  }, [isConnected]);

  // ✅ Enhanced: Handle reconnection issues
  useEffect(() => {
    if (isReconnecting) {
      console.log('🔄 Reconnecting to wallet...');
    }
  }, [isReconnecting]);

  // Show connection status for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const debugInfo = {
        isConnected,
        isConnecting,
        isReconnecting,
        isPending,
        connectionAttempts,
        lastError,
        availableConnectors: connectors.map(c => c.name),
      };
      
      // Only log if there's an issue or significant state change
      if (lastError || isConnecting || isReconnecting || connectionAttempts > 0) {
        console.log('🔍 Wallet Connection Debug:', debugInfo);
      }
    }
  }, [isConnected, isConnecting, isReconnecting, isPending, connectionAttempts, lastError, connectors]);

  return <>{children}</>;
}
