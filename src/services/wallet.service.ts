import apiClient from "@/lib/api";
import type { AddWalletPayload, Wallet } from "@/types";

/**
 * Real backend payload for POST /wallets
 * userId must be passed from the auth store
 */
export interface AddWalletApiPayload extends AddWalletPayload {
  userId: string;
}

/** Shape returned by POST /wallets */
export interface AddWalletResponse {
  walletId: string;
  address: string;
  chainType: string;
  syncStatus: string;
}

export const walletService = {
  /**
   * POST /wallets — register a wallet for a user
   * Backend has no GET /wallets endpoint, so we only support adding.
   * The wallet list is maintained locally in the Zustand store.
   */
  async addWallet(payload: AddWalletApiPayload): Promise<AddWalletResponse> {
    const { data } = await apiClient.post<AddWalletResponse>("/wallets", payload);
    return data;
  },
};
