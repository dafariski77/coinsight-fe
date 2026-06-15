// ─── Enums ────────────────────────────────────────────────────────────────────

export type ChainType = "SOLANA" | "ETHEREUM" | "POLYGON";
export type SyncStatus = "PENDING" | "SYNCING" | "COMPLETED";
export type TransactionType = "SWAP" | "SEND" | "RECEIVE" | "MINT";
export type TransactionStatus = "SUCCESS" | "FAILED";

// ─── Write Model (PostgreSQL) ──────────────────────────────────────────────────

export interface User {
  id: string;
  email?: string | null;
  createdAt: string;
  walletAddress?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  chainType: ChainType;
  syncStatus: SyncStatus;
  createdAt?: string;
}

export interface RawTransaction {
  id: string;
  walletId: string;
  signature: string;
  blockTime: string;
  fee: number;
  status: TransactionStatus;
}

export interface TokenTransfer {
  id: string;
  txId: string;
  tokenMint: string;
  amount: bigint;
  direction: "IN" | "OUT";
}

// ─── Read Model (MongoDB projections) ─────────────────────────────────────────

export interface Asset {
  tokenMint: string;
  symbol: string;
  chain: ChainType;
  balance: number;
  currentPriceUsd: number;
  totalValueUsd: number;
  allocationPercentage: number;
  logoUrl?: string;
}

export interface PortfolioSummary {
  userId: string;
  totalNetWorthUsd: number;
  lastSyncedAt: string;
  assets: Asset[];
  change24hPercent?: number;
  change24hUsd?: number;
}

export interface TransactionTokenInfo {
  symbol: string;
  amountFormatted: number;
  usdValueAtTime: number;
  logoUrl?: string;
}

export interface TransactionDetails {
  tokenIn?: TransactionTokenInfo;
  tokenOut?: TransactionTokenInfo;
  token?: TransactionTokenInfo;
}

export interface EnrichedTransaction {
  id: string;
  userId: string;
  walletAddress: string;
  signature: string;
  type: TransactionType;
  timestamp: string;
  details: TransactionDetails;
  feeUsd: number;
  status: TransactionStatus;
}

// ─── API Helpers ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface NonceResponse {
  nonce: string;
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AddWalletPayload {
  address: string;
  chainType: ChainType;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType | "";
  walletAddress?: string;
  token?: string;
}
