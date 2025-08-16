import { gql } from '@apollo/client';

// User Trading History - Main query for history page
export const GET_USER_TRADING_HISTORY = gql`
  query GetUserTradingHistory($walletAddress: String!, $limit: Int = 50) {
    swapss(
      where: { trader: $walletAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        pool_id
        trader
        dex_name
        token_in
        token_out
        amount_in
        amount_out
        timestamp
        block_number
        transaction_hash
      }
    }
  }
`;

// Trading by DEX - For filtering by specific DEX
export const GET_TRADING_BY_DEX = gql`
  query GetTradingByDEX($dexName: String!, $limit: Int = 50) {
    swapss(
      where: { dex_name: $dexName }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        pool_id
        trader
        dex_name
        token_in
        token_out
        amount_in
        amount_out
        timestamp
        block_number
        transaction_hash
      }
    }
  }
`;

// Trading by DEX and User - For user-specific DEX filtering
export const GET_TRADING_BY_DEX_AND_TRADER = gql`
  query GetTradingByDEXAndTrader($dexName: String!, $trader: String!, $limit: Int = 50) {
    swapss(
      where: { 
        dex_name: $dexName,
        trader: $trader
      }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        pool_id
        trader
        dex_name
        token_in
        token_out
        amount_in
        amount_out
        timestamp
        block_number
        transaction_hash
      }
    }
  }
`;

// All Trading Data with Optional Filters
export const GET_ALL_TRADING_DATA = gql`
  query GetAllTradingData($dexName: String, $trader: String, $limit: Int = 50) {
    swapss(
      where: { 
        dex_name: $dexName,
        trader: $trader
      }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        pool_id
        trader
        dex_name
        token_in
        token_out
        amount_in
        amount_out
        timestamp
        block_number
        transaction_hash
      }
    }
  }
`;

// Get Pool by Wallet Address - For user's liquidity positions
export const GET_POOL_BY_WALLET_ADDRESS = gql`
  query GetPoolsByCreator($creatorAddress: String!) {
    poolss(
      where: { creator: $creatorAddress }
      orderBy: "created_at"
      orderDirection: "desc"
    ) {
      items {
        id
        token_a
        token_b
        creator
        dex_name
        reserve_a
        reserve_b
        total_supply
        created_at
        block_number
        transaction_hash
      }
    }
  }
`;