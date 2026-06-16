"use client";

import { useState } from "react";
import { TxTypeBadge } from "@/components/ui/Badge";
import type { EnrichedTransaction } from "@/types";

interface TransactionRowProps {
  tx: EnrichedTransaction;
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function TxAmounts({ tx }: { tx: EnrichedTransaction }) {
  const { type, details } = tx;

  if (type === "SWAP" && details.tokenIn && details.tokenOut) {
    return (
      <div className="tx-amounts">
        <span className="tx-amount-out">
          -{details.tokenIn.amountFormatted} {details.tokenIn.symbol}
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400, fontSize: "11px", marginLeft: 4 }}>
            ({formatUSD(details.tokenIn.usdValueAtTime)})
          </span>
        </span>
        <span className="tx-amount-in">
          +{details.tokenOut.amountFormatted} {details.tokenOut.symbol}
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400, fontSize: "11px", marginLeft: 4 }}>
            ({formatUSD(details.tokenOut.usdValueAtTime)})
          </span>
        </span>
      </div>
    );
  }

  if (type === "RECEIVE" && details.token) {
    return (
      <div className="tx-amounts">
        <span className="tx-amount-in">
          +{details.token.amountFormatted} {details.token.symbol}
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400, fontSize: "11px", marginLeft: 4 }}>
            ({formatUSD(details.token.usdValueAtTime)})
          </span>
        </span>
      </div>
    );
  }

  if ((type === "SEND" || type === "MINT") && details.token) {
    return (
      <div className="tx-amounts">
        <span className={type === "SEND" ? "tx-amount-out" : "tx-amount-neutral"}>
          {type === "SEND" ? "-" : "✦"}{details.token.amountFormatted} {details.token.symbol}
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400, fontSize: "11px", marginLeft: 4 }}>
            ({formatUSD(details.token.usdValueAtTime)})
          </span>
        </span>
      </div>
    );
  }

  return <span style={{ color: "var(--color-text-muted)" }}>—</span>;
}

function TransactionDetail({ tx, onClose }: { tx: EnrichedTransaction; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", justifyContent: "flex-end"
    }}>
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />
      <div style={{
        position: "relative", width: "420px", height: "100vh",
        background: "var(--color-bg-elevated)",
        borderLeft: "1px solid var(--color-border)",
        padding: "var(--space-8)",
        overflowY: "auto",
        animation: "slideInLeft 0.25s ease",
        display: "flex", flexDirection: "column", gap: "var(--space-6)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", fontWeight: 700 }}>
            Transaction Details
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close detail drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <TxTypeBadge type={tx.type} />
        </div>

        {[
          ["Wallet", shortAddr(tx.walletAddress)],
          ["Signature", `${tx.signature.slice(0, 16)}…`],
          ["Time", new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(tx.timestamp))],
          ["Fee", tx.feeUsd === 0 ? "—" : `${formatUSD(tx.feeUsd)}`],
          ["Status", tx.status],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-3) 0", borderBottom: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{label}</span>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
          </div>
        ))}

        {tx.type === "SWAP" && tx.details.tokenIn && tx.details.tokenOut && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Swap Details</p>
            <div className="card card-padding" style={{ gap: "var(--space-2)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Token In</span>
                <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>{tx.details.tokenIn.amountFormatted} {tx.details.tokenIn.symbol}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Token Out</span>
                <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{tx.details.tokenOut.amountFormatted} {tx.details.tokenOut.symbol}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionRow({ tx }: TransactionRowProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        className="tx-row"
        role="row"
        onClick={() => setShowDetail(true)}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setShowDetail(true)}
        aria-label={`${tx.type} transaction at ${formatTime(tx.timestamp)}`}
      >
        <div>
          <TxTypeBadge type={tx.type} />
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
            {formatTime(tx.timestamp)}
          </p>
        </div>

        <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
          {shortAddr(tx.walletAddress)}
        </div>

        <TxAmounts tx={tx} />

        <div className="tx-meta">
          {tx.feeUsd > 0 && (
            <p>Fee: {formatUSD(tx.feeUsd)}</p>
          )}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: 4, opacity: 0.4 }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {showDetail && (
        <TransactionDetail tx={tx} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
