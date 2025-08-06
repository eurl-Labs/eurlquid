'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import Image from 'next/image';

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="cursor-pointer group relative flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl min-w-[150px] justify-center"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="cursor-pointer group relative flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl min-w-[150px] justify-center"
                  >
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="group relative flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 text-white font-medium text-sm rounded-lg hover:bg-black/30 hover:border-white/30 transition-all duration-300"
                  >
                    {/* Custom Sonic Logo for Sonic Blaze Testnet */}
                    {chain.id === 57054 ? (
                      <Image
                        src="/images/logoCoin/sonicLogo.png"
                        alt="Sonic logo"
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    ) : chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="group relative flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}