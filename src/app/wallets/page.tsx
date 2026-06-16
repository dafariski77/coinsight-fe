"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WalletCard } from "@/components/wallet/WalletCard";
import { AddWalletModal } from "@/components/wallet/AddWalletModal";
import { useWallets, useAddWallet, useRemoveWallet } from "@/hooks/useWallets";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AddWalletPayload } from "@/types";

export default function WalletsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);

  const wallets = useWallets();
  const isLoading = false; // Local store is synchronous
  const addWallet = useAddWallet();
  const removeWallet = useRemoveWallet();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleAdd = async (payload: AddWalletPayload) => {
    await addWallet.mutateAsync(payload);
  };

  return (
    <DashboardLayout title="Wallet Management">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title font-display">Wallets</h2>
          <p className="page-subtitle">
            Manage wallet addresses you want to track across multiple chains
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
          id="open-add-wallet-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Wallet
        </button>
      </div>

      {/* Stats bar */}
      {wallets && wallets.length > 0 && (
        <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)", padding: "var(--space-4) var(--space-6)", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", flexWrap: "wrap" }}>
          {[
            { label: "Total Wallets", value: wallets.length },
            { label: "Completed", value: wallets.filter((w) => w.syncStatus === "COMPLETED").length },
            { label: "Syncing", value: wallets.filter((w) => w.syncStatus === "SYNCING").length },
            { label: "Pending", value: wallets.filter((w) => w.syncStatus === "PENDING").length },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
              <span style={{ fontSize: "22px", fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="wallets-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !wallets || wallets.length === 0 ? (
        <EmptyState
          icon="👛"
          title="No wallets added yet"
          description="Add your first wallet address to start tracking your portfolio."
          action={
            <button className="btn btn-primary" onClick={() => setModalOpen(true)} id="empty-add-wallet-btn">
              Add Your First Wallet
            </button>
          }
        />
      ) : (
        <div className="wallets-grid">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onRemove={(id) => removeWallet.mutate(id)}
              isRemoving={removeWallet.isPending}
            />
          ))}
        </div>
      )}

      {/* Add Wallet Modal */}
      <AddWalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        isLoading={addWallet.isPending}
      />
    </DashboardLayout>
  );
}
