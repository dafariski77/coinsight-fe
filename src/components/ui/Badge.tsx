"use client";

import type { ChainType, TransactionType, SyncStatus } from "@/types";

interface BadgeProps {
  className?: string;
}

export function ChainBadge({ chain }: { chain: ChainType } & BadgeProps) {
  const classMap: Record<ChainType, string> = {
    ETHEREUM: "badge badge-eth",
    SOLANA: "badge badge-sol",
    POLYGON: "badge badge-polygon",
  };

  const icons: Record<ChainType, string> = {
    ETHEREUM: "Ξ",
    SOLANA: "◎",
    POLYGON: "⬡",
  };

  return (
    <span className={classMap[chain]}>
      {icons[chain]} {chain}
    </span>
  );
}

export function TxTypeBadge({ type }: { type: TransactionType } & BadgeProps) {
  const classMap: Record<TransactionType, string> = {
    SWAP: "badge badge-swap",
    SEND: "badge badge-send",
    RECEIVE: "badge badge-receive",
    MINT: "badge badge-mint",
  };

  const icons: Record<TransactionType, string> = {
    SWAP: "⇄",
    SEND: "↑",
    RECEIVE: "↓",
    MINT: "✦",
  };

  return (
    <span className={classMap[type]}>
      {icons[type]} {type}
    </span>
  );
}

export function SyncBadge({ status }: { status: SyncStatus } & BadgeProps) {
  const classMap: Record<SyncStatus, string> = {
    PENDING: "badge badge-pending",
    SYNCING: "badge badge-syncing",
    COMPLETED: "badge badge-completed",
  };

  const icons: Record<SyncStatus, string> = {
    PENDING: "○",
    SYNCING: "↻",
    COMPLETED: "✓",
  };

  return (
    <span className={classMap[status]}>
      {status === "SYNCING" && (
        <span className="spinner spinner-sm" style={{ borderTopColor: "currentcolor", marginRight: 4 }} />
      )}
      {icons[status]} {status}
    </span>
  );
}
