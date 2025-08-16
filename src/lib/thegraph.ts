import axios from 'axios';

// Build correct URL using subgraph ID.
// If THEGRAPH_API_KEY exists, use gateway form:
//   https://gateway.thegraph.com/api/<API_KEY>/subgraphs/id/<SUBGRAPH_ID>
// Else fallback to hosted service:
//   https://api.thegraph.com/subgraphs/id/<SUBGRAPH_ID>
function graphUrlForId(subgraphId: string) {
  const apiKey = process.env.THEGRAPH_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    return `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${subgraphId}`;
  }
  return `https://api.thegraph.com/subgraphs/id/${subgraphId}`;
}

// Provided subgraph IDs
const SUBGRAPH_IDS = {
  uniswapV3Ethereum: process.env.THEGRAPH_SUBGRAPH_ID_UNISWAP_V3_ETHEREUM || '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV',
  uniswapV2Ethereum: process.env.THEGRAPH_SUBGRAPH_ID_UNISWAP_V2_ETHEREUM || 'A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum',
  curveEthereum: process.env.THEGRAPH_SUBGRAPH_ID_CURVE_ETHEREUM || '3fy93eAT56UJsRCEht8iFhfi6wjHWXtZ9dnnbQmvFopF',
  curveArbitrum: process.env.THEGRAPH_SUBGRAPH_ID_CURVE_ARBITRUM || 'Gv6NJRut2zrm79ef4QHyKAm41YHqaLF392sM3cz9wywc',
  balancerEthereum: process.env.THEGRAPH_SUBGRAPH_ID_BALANCER_ETHEREUM || 'C4ayEZP2yTXRAB8vSaTrgN4m9anTe9Mdm2ViyiAuV9TV',
} as const;

export type Subgraph = keyof typeof SUBGRAPH_IDS;

const endpoints: Record<Subgraph, string> = {
  uniswapV3Ethereum: graphUrlForId(SUBGRAPH_IDS.uniswapV3Ethereum),
  uniswapV2Ethereum: graphUrlForId(SUBGRAPH_IDS.uniswapV2Ethereum),
  curveEthereum: graphUrlForId(SUBGRAPH_IDS.curveEthereum),
  curveArbitrum: graphUrlForId(SUBGRAPH_IDS.curveArbitrum),
  balancerEthereum: graphUrlForId(SUBGRAPH_IDS.balancerEthereum),
};

export async function theGraphQuery<T = any>(subgraph: Subgraph, query: string, variables?: Record<string, any>): Promise<T> {
  const url = endpoints[subgraph];
  const res = await axios.post(url, { query, variables }, { headers: { 'Content-Type': 'application/json' } });
  if (res.data?.errors) throw new Error(JSON.stringify(res.data.errors));
  return res.data.data as T;
}

export const queries = {
  uniswapV3: {
    pools: (first = 10) => `
      query ($first: Int!) {
        pools(first: $first, orderBy: totalValueLockedUSD, orderDirection: desc) {
          id
          feeTier
          token0 { id symbol decimals }
          token1 { id symbol decimals }
          liquidity
          sqrtPrice
          tick
          totalValueLockedUSD
          volumeUSD
          feesUSD
        }
      }
    `,
    poolsByTokens: (token0: string, token1: string, first = 5) => `
      query ($first: Int!) {
        pools(
          first: $first,
          orderBy: totalValueLockedUSD,
          orderDirection: desc,
          where: {
            token0_in: ["${token0.toLowerCase()}", "${token1.toLowerCase()}"],
            token1_in: ["${token0.toLowerCase()}", "${token1.toLowerCase()}"]
          }
        ) {
          id
          feeTier
          token0 { id symbol decimals }
          token1 { id symbol decimals }
          liquidity
          totalValueLockedUSD
          volumeUSD
          feesUSD
        }
      }
    `,
  },
  curve: {
    tokens: (first = 10) => `
      {
        tokens(first: ${first}) {
          id
          name
          symbol
          decimals
        }
      }
    `,
  },
  balancer: {
    pools: (first = 5) => `
      query ($first: Int!) {
        balancers(first: $first) {
          id
          poolCount
          pools {
            id
          }
          snapshots {
            id
          }
        }
        pools(first: $first) {
          id
          address
          poolType
          poolTypeVersion
        }
      }
    `,
    poolsByTokens: (first = 5) => `
      query ($first: Int!) {
        pools(first: $first) {
          id
          address
          poolType
          poolTypeVersion
          tokens {
            address
            symbol
            decimals
          }
        }
      }
    `,
  }
};
