import { TokenInfo, DexInfo } from "@/types/history";

const baseTokens = [
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F",
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
    address: "0xBBc467639fbEeDF5ec1eDFfC7Ed22b4666Cdd4bA",
    logo: "/images/logoCoin/wbtcLogo.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0x0e07bce15e5Ae4729eE24b6294Aef7bcB6c2a260",
    logo: "/images/logoCoin/ethLogo.png",
  },
  {
    symbol: "WSONIC",
    name: "Wrapped Sonic",
    address: "0x6e943f6BFb751512C68d7fB32dB4C3A51011656a",
    logo: "/images/logoCoin/sonicLogo.png",
  },
  {
    symbol: "PEPE",
    name: "Pepe",
    address: "0x6EB23CA35D4F467d0d2c326B1E23C8BFDF0688B4",
    logo: "/images/logoCoin/pepeLogo.png",
  },
  {
    symbol: "PENGU",
    name: "Pengu",
    address: "0x894a84F584D4b84697854Ba0a895Eb122e8791A9",
    logo: "/images/logoCoin/penguLogo.png",
  },
  {
    symbol: "DPENGU",
    name: "Dark Pengu",
    address: "0x7DE89E03157F4866Ff5A4F04d3297e88C54bbdb8",
    logo: "/images/logoCoin/darkPenguLogo.png",
  },
  {
    symbol: "GOONER",
    name: "Gooner",
    address: "0x92EeEd76021665B8D926069ecd9b5986c6c779fb",
    logo: "/images/logoCoin/goonerLogo.png",
  },
  {
    symbol: "ABSTER",
    name: "Abster",
    address: "0xa989FAf5595228A42C701590515152c2aE0eaC39",
    logo: "/images/logoCoin/absterLogo.png",
  },
  {
    symbol: "POLLY",
    name: "Polly",
    address: "0xFD9bd8cfc9f6326A1496f240E83ff6717f960E20",
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
