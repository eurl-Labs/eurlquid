"use client";

import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { sonicMainnet } from "@/config/reown";

export function ReownConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isWrongNetwork = chainId && chainId !== sonicMainnet.id;

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        type="button"
        className="cursor-pointer group relative flex items-center gap-2 px-2 md:px-6 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl min-w-[150px] justify-center"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={() => open({ view: "Networks" })}
        type="button"
        className="cursor-pointer group relative flex items-center gap-2 md:px-6 py-3 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl min-w-[150px] justify-center"
      >
        <span>Wrong Network</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => open({ view: "Networks" })}
        type="button"
        className="group relative flex items-center gap-2 px-0.5 md:px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 text-white font-medium text-sm rounded-lg hover:bg-black/30 hover:border-white/30 transition-all duration-300"
      >
        {chainId === sonicMainnet.id ? (
          <Image
            src="/images/logoCoin/sonicLogo.png"
            alt="Sonic logo"
            width={16}
            height={16}
            className="rounded-full"
          />
        ) : (
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: "#3b82f6",
            }}
          />
        )}
        {chainId === sonicMainnet.id ? "Sonic Mainnet" : "Unknown Network"}
      </button>

      <button
        onClick={() => open({ view: "Account" })}
        type="button"
        className="group relative flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Wallet className="w-4 h-4" />
        <span>{address ? formatAddress(address) : "Connected"}</span>
      </button>
    </div>
  );
}
