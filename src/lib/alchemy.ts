import { http, webSocket, createPublicClient } from "viem";
import { mainnet, arbitrum, base } from "viem/chains";

const ALCHEMY_HTTP_ETHEREUM =
  process.env.ALCHEMY_HTTP_ETHEREUM ||
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const ALCHEMY_HTTP_ARBITRUM =
  process.env.ALCHEMY_HTTP_ARBITRUM ||
  `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const ALCHEMY_HTTP_BASE =
  process.env.ALCHEMY_HTTP_BASE ||
  `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const ALCHEMY_WS_ETHEREUM =
  process.env.ALCHEMY_WS_ETHEREUM ||
  `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const ALCHEMY_WS_ARBITRUM =
  process.env.ALCHEMY_WS_ARBITRUM ||
  `wss://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const ALCHEMY_WS_BASE =
  process.env.ALCHEMY_WS_BASE ||
  `wss://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

export const httpClients = {
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: http(ALCHEMY_HTTP_ETHEREUM),
  }),
  [arbitrum.id]: createPublicClient({
    chain: arbitrum,
    transport: http(ALCHEMY_HTTP_ARBITRUM),
  }),
  [base.id]: createPublicClient({
    chain: base,
    transport: http(ALCHEMY_HTTP_BASE),
  }),
};

export const wsClients = {
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: webSocket(ALCHEMY_WS_ETHEREUM),
  }),
  [arbitrum.id]: createPublicClient({
    chain: arbitrum,
    transport: webSocket(ALCHEMY_WS_ARBITRUM),
  }),
  [base.id]: createPublicClient({
    chain: base,
    transport: webSocket(ALCHEMY_WS_BASE),
  }),
};

export type SupportedChainId = keyof typeof httpClients;
