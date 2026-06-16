"use client";

import { useMutation } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/ui.store";
import type { AddWalletPayload, Wallet } from "@/types";

/**
 * Returns the locally-persisted wallet list (since there is no GET /wallets).
 */
export function useWallets() {
  const { wallets } = useWalletStore();
  return wallets;
}

export function useAddWallet() {
  const { user } = useAuthStore();
  const { addWallet } = useWalletStore();

  return useMutation({
    mutationFn: async (payload: AddWalletPayload) => {
      if (!user?.id) throw new Error("Not authenticated");

      const response = await walletService.addWallet({
        ...payload,
        userId: user.id,
      });

      // Map API response → local Wallet shape
      const wallet: Wallet = {
        id: response.walletId,
        userId: user.id,
        address: response.address,
        chainType: response.chainType as Wallet["chainType"],
        syncStatus: response.syncStatus as Wallet["syncStatus"],
        createdAt: new Date().toISOString(),
      };

      return wallet;
    },
    onSuccess: (wallet) => {
      addWallet(wallet);
    },
  });
}

export function useRemoveWallet() {
  const { removeWallet } = useWalletStore();

  return useMutation({
    mutationFn: async (id: string) => {
      // Backend has no DELETE /wallets endpoint — remove locally only
      removeWallet(id);
      return id;
    },
  });
}
