// ─── Enums ────────────────────────────────────────────────────────────────────

export type ChainType = "SOLANA" | "ETHEREUM" | "POLYGON";
export type SyncStatus = "PENDING" | "SYNCING" | "COMPLETED";
export type TransactionType = "SWAP" | "SEND" | "RECEIVE" | "MINT";
export type TransactionStatus = "SUCCESS" | "FAILED";

// ─── User (stored in Zustand after connect) ───────────────────────────────────

export interface User {
  id: string;
  email?: string | null;
  createdAt?: string;
  walletAddress?: string; // connected wallet address (used as userId)
}

// ─── Wallet (local state — backend only has POST /wallets, no GET) ─────────────

export interface Wallet {
  id: string;           // walletId from API response
  userId: string;
  address: string;
  chainType: ChainType;
  syncStatus: SyncStatus;
  createdAt?: string;
}

// ─── Portfolio — matches MongoDB portfolio_summaries collection ───────────────

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
  lastSyncedAt: string | null;
  assets: Asset[];
  message?: string; // "Portfolio not yet synced. Add a wallet to start."
  change24hPercent?: number;
  change24hUsd?: number;
}

// ─── Transactions — matches MongoDB enriched_transactions collection ───────────

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
  _id?: string;           // MongoDB ObjectId
  id?: string;
  userId: string;
  walletAddress: string;
  signature: string;
  type: TransactionType;
  timestamp: string;
  details: TransactionDetails;
  feeUsd: number;
  status?: TransactionStatus;
}

// ─── API Helpers ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number; // real backend field
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── Payload types ────────────────────────────────────────────────────────────

export interface AddWalletPayload {
  address: string;
  chainType: ChainType;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType | "";
  walletAddress?: string; // for local filter display only (not sent to API)
  token?: string;         // for local filter display only (not sent to API)
}
