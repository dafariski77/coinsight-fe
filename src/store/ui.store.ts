import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransactionFilters, Wallet } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  transactionFilters: TransactionFilters;
  setTransactionFilters: (filters: Partial<TransactionFilters>) => void;
  resetTransactionFilters: () => void;
}

/**
 * Wallet store — persists wallet list locally.
 * The backend only has POST /wallets (no GET /wallets),
 * so we maintain the user's wallet list in localStorage.
 */
interface WalletState {
  wallets: Wallet[];
  addWallet: (wallet: Wallet) => void;
  removeWallet: (id: string) => void;
  updateSyncStatus: (id: string, status: Wallet["syncStatus"]) => void;
  clearWallets: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallets: [],

      addWallet: (wallet) =>
        set((s) => ({
          wallets: s.wallets.some((w) => w.address === wallet.address && w.chainType === wallet.chainType)
            ? s.wallets
            : [...s.wallets, wallet],
        })),

      removeWallet: (id) =>
        set((s) => ({ wallets: s.wallets.filter((w) => w.id !== id) })),

      updateSyncStatus: (id, status) =>
        set((s) => ({
          wallets: s.wallets.map((w) =>
            w.id === id ? { ...w, syncStatus: status } : w
          ),
        })),

      clearWallets: () => set({ wallets: [] }),
    }),
    {
      name: "wallet-storage",
    }
  )
);

// ─── UI Store ─────────────────────────────────────────────────────────────────

const defaultFilters: TransactionFilters = {
  page: 1,
  limit: 20,
  type: "",
  walletAddress: "",
  token: "",
};

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  transactionFilters: defaultFilters,
  setTransactionFilters: (filters) =>
    set((s) => ({
      transactionFilters: { ...s.transactionFilters, ...filters, page: 1 },
    })),
  resetTransactionFilters: () =>
    set({ transactionFilters: defaultFilters }),
}));
