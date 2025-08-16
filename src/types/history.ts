export interface Pool {
  id: string;
  token_a: string;
  token_b: string;
  creator: string;
  dex_name: string;
  reserve_a: string;
  reserve_b: string;
  total_supply: string;
  created_at: string;
  block_number: string;
  transaction_hash: string;
}

export interface Swap {
  id: string;
  pool_id: string;
  trader: string;
  dex_name: string;
  token_in: string;
  token_out?: string;
  amount_in: string;
  amount_out: string;
  timestamp: string;
  block_number: string;
  transaction_hash: string;
}

export interface PoolsResponse {
  poolss: {
    items: Pool[];
  };
}

export interface SwapsResponse {
  swapss: {
    items: Swap[];
  };
}

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  logo: string;
}

export interface DexInfo {
  name: string;
  logo: string;
}