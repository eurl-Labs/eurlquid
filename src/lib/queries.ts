import { gql } from '@apollo/client';

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

export const GET_POOL_BY_DEX_AGGREGATOR = gql`
  query GetPoolsByDEX($dexName: String!, $limit: Int = 6) {
    poolss(
      where: { dex_name: $dexName }
      orderBy: "created_at"
      orderDirection: "desc"
      limit: $limit
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