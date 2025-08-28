import { TokenInfo, DexInfo } from "@/types/history";

const baseTokens = [
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xb13aF633516fe0d21BeB466C95fc34C3917BaAFb",
    logo: "/images/logoCoin/usdtLogo.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae",
    logo: "/images/logoCoin/usdcLogo.png",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x395eAc2CE4fFFcd578652D689A0eeCC608649200",
    logo: "/images/logoCoin/wbtcLogo.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0x931753b7A1141d23066fb7a0785ab5c2c1522F43",
    logo: "/images/logoCoin/ethLogo.png",
  },
  {
    symbol: "WSONIC",
    name: "Wrapped Sonic",
    address: "0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F",
    logo: "/images/logoCoin/sonicLogo.png",
  },
  {
    symbol: "PEPE",
    name: "Pepe",
    address: "0xeC4671DdD18f88eF7076124895cf42E067f3D4C5",
    logo: "/images/logoCoin/pepeLogo.png",
  },
  {
    symbol: "PENGU",
    name: "Pengu",
    address: "0x2b026284561AF82CC015e61d2ecB5b7653f36190",
    logo: "/images/logoCoin/penguLogo.png",
  },
  {
    symbol: "DPENGU",
    name: "Dark Pengu",
    address: "0x2b0b61AE71d390E8874cE405f05291DD405407ED",
    logo: "/images/logoCoin/darkPenguLogo.png",
  },
  {
    symbol: "GOONER",
    name: "Gooner",
    address: "0x7cDaE08eFA988318feE67342a9CD06449D7651dB",
    logo: "/images/logoCoin/goonerLogo.png",
  },
  {
    symbol: "ABSTER",
    name: "Abster",
    address: "0xc7251A2D1bcCF362F6D333977B2817710Aa71707",
    logo: "/images/logoCoin/absterLogo.png",
  },
  {
    symbol: "POLLY",
    name: "Polly",
    address: "0xa83A7118481D3C5A2DDa8ac5F34c8b690Cb0a242",
    logo: "/images/logoCoin/pollyLogo.jpg",
  },
];

export const TOKEN_MAPPING: Record<string, TokenInfo> = {};

baseTokens.forEach((token) => {
  TOKEN_MAPPING[token.address] = token;
  TOKEN_MAPPING[token.address.toLowerCase()] = token;
});

export const DEX_MAPPING: Record<string, DexInfo> = {
  Uniswap: {
    name: "Uniswap",
    logo: "/images/logo/uniLogo.svg.png",
  },
  Balancer: {
    name: "Balancer",
    logo: "/images/logo/balancerLogo.png",
  },
  Curve: {
    name: "Curve",
    logo: "/images/logo/curveLogo.png",
  },
  OneInch: {
    name: "OneInch",
    logo: "/images/logo/1inchLogo.png",
  },
};

export const getTokenInfo = (address: string): TokenInfo | null => {
  if (!address) return null;

  const directMatch = TOKEN_MAPPING[address];
  if (directMatch) return directMatch;

  const lowerCaseMatch = TOKEN_MAPPING[address.toLowerCase()];
  if (lowerCaseMatch) return lowerCaseMatch;

  return null;
};

export const getDexInfo = (name: string): DexInfo | null => {
  return DEX_MAPPING[name] || null;
};

export const formatTokenAmount = (
  amount: string,
  decimals: number = 18
): string => {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const formatted = Number(value) / Number(divisor);
  return formatted.toLocaleString(undefined, { maximumFractionDigits: 6 });
};
