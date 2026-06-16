"use client";

import { useState } from "react";
import { ChainBadge, SyncBadge } from "@/components/ui/Badge";
import type { Wallet } from "@/types";

interface WalletCardProps {
  wallet: Wallet;
  onRemove: (id: string) => void;
  isRemoving?: boolean;
}

function shortAddress(addr: string, head = 8, tail = 6): string {
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
}

export function WalletCard({ wallet, onRemove, isRemoving }: WalletCardProps) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = () => {
    copyToClipboard(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onRemove(wallet.id);
  };

  return (
    <div className="card wallet-card card--glow">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <ChainBadge chain={wallet.chainType} />
        <SyncBadge status={wallet.syncStatus} />
      </div>

      {/* Address */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "var(--space-2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Address
        </p>
        <p className="wallet-address" title={wallet.address}>
          {wallet.address}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
          Added {formatDate(wallet.createdAt)}
        </p>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            title="Copy address"
            id={`copy-wallet-${wallet.id}`}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>

          <button
            className={`btn btn-sm ${confirmDelete ? "btn-danger" : "btn-ghost"}`}
            onClick={handleRemove}
            disabled={isRemoving}
            title={confirmDelete ? "Click again to confirm" : "Remove wallet"}
            id={`remove-wallet-${wallet.id}`}
          >
            {isRemoving ? (
              <span className="spinner spinner-sm" />
            ) : confirmDelete ? (
              "Confirm?"
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
