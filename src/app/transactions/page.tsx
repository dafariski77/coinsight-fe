"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionRow } from "@/components/transaction/TransactionRow";
import { useTransactions } from "@/hooks/useTransactions";
import { useUIStore } from "@/store/ui.store";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TransactionType } from "@/types";

const TX_TYPES: { value: TransactionType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "SWAP", label: "⇄ Swap" },
  { value: "SEND", label: "↑ Send" },
  { value: "RECEIVE", label: "↓ Receive" },
  { value: "MINT", label: "✦ Mint" },
];

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { transactionFilters, setTransactionFilters, resetTransactionFilters } = useUIStore();

  const { data, isLoading, isError, refetch } = useTransactions(transactionFilters);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const hasFilters = !!transactionFilters.type || !!transactionFilters.walletAddress || !!transactionFilters.token;

  return (
    <DashboardLayout title="Transaction History">
      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title font-display">Transactions</h2>
        <p className="page-subtitle">
          Aggregated transaction history from all your tracked wallets
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" role="search" aria-label="Transaction filters">
        <span className="filter-label">Filter</span>

        {/* Type filter */}
        <select
          className="input select"
          style={{ width: "auto", minWidth: "130px" }}
          value={transactionFilters.type ?? ""}
          onChange={(e) => setTransactionFilters({ type: e.target.value as TransactionType | "" })}
          id="tx-type-filter"
          aria-label="Filter by type"
        >
          {TX_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* Wallet search */}
        <input
          className="input"
          style={{ flex: 1, minWidth: "200px", maxWidth: "320px" }}
          type="text"
          placeholder="Filter by wallet address…"
          value={transactionFilters.walletAddress ?? ""}
          onChange={(e) => setTransactionFilters({ walletAddress: e.target.value })}
          id="tx-wallet-filter"
          aria-label="Filter by wallet address"
        />

        {/* Token search */}
        <input
          className="input"
          style={{ width: "130px" }}
          type="text"
          placeholder="Token (ETH, SOL…)"
          value={transactionFilters.token ?? ""}
          onChange={(e) => setTransactionFilters({ token: e.target.value })}
          id="tx-token-filter"
          aria-label="Filter by token"
        />

        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={resetTransactionFilters}
            id="clear-tx-filters-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}

        {data && (
          <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
            {data.total} transaction{data.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Transaction List */}
      <div className="card" style={{ overflow: "hidden" }}>
        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr 1fr auto",
          gap: "var(--space-4)",
          padding: "var(--space-3) var(--space-6)",
          borderBottom: "1px solid var(--color-border)",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: "var(--color-text-muted)",
        }}>
          <span>Type</span>
          <span>Wallet</span>
          <span>Amount</span>
          <span style={{ textAlign: "right" }}>Fee</span>
        </div>

        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon="⚠️"
            title="Failed to load transactions"
            description="Could not fetch transaction history."
            action={
              <button className="btn btn-primary btn-sm" onClick={() => refetch()} id="retry-tx-btn">
                Retry
              </button>
            }
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            icon="📋"
            title={hasFilters ? "No matching transactions" : "No transactions yet"}
            description={
              hasFilters
                ? "Try adjusting or clearing your filters."
                : "Transaction history will appear here once your wallets sync."
            }
            action={
              hasFilters ? (
                <button className="btn btn-secondary btn-sm" onClick={resetTransactionFilters} id="clear-filters-empty-btn">
                  Clear Filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <div
            className="transaction-list"
            role="list"
            aria-label="Transaction list"
          >
            {data.data.map((tx) => (
              <div role="listitem" key={tx.id}>
                <TransactionRow tx={tx} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.total > (transactionFilters.limit ?? 20) && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-6)" }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={(transactionFilters.page ?? 1) <= 1}
            onClick={() => setTransactionFilters({ page: (transactionFilters.page ?? 1) - 1 })}
            id="tx-prev-page-btn"
          >
            ← Previous
          </button>
          <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Page {transactionFilters.page ?? 1} of {Math.ceil(data.total / (transactionFilters.limit ?? 20))}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={(transactionFilters.page ?? 1) >= data.totalPages}
            onClick={() => setTransactionFilters({ page: (transactionFilters.page ?? 1) + 1 })}
            id="tx-next-page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
