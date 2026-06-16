"use client";

import type { PortfolioSummary } from "@/types";

interface NetWorthCardProps {
  data: PortfolioSummary;
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NetWorthCard({ data }: NetWorthCardProps) {
  const isPositive = (data.change24hPercent ?? 0) >= 0;

  return (
    <div className="net-worth-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--color-text-secondary)", marginBottom: "var(--space-3)" }}>
            Total Net Worth
          </p>
          <div className="net-worth-value" aria-label={`Total portfolio value: ${formatUSD(data.totalNetWorthUsd)}`}>
            {formatUSD(data.totalNetWorthUsd)}
          </div>

          {data.change24hPercent !== undefined && (
            <div className={`net-worth-change ${isPositive ? "positive" : "negative"}`}>
              <span aria-hidden>{isPositive ? "▲" : "▼"}</span>
              <span>
                {isPositive ? "+" : ""}{data.change24hPercent.toFixed(2)}%
                {data.change24hUsd !== undefined && (
                  <span style={{ fontWeight: 400, marginLeft: 6, color: "var(--color-text-secondary)", fontSize: "13px" }}>
                    ({isPositive ? "+" : ""}{formatUSD(data.change24hUsd)})
                  </span>
                )}
              </span>
              <span style={{ fontWeight: 400, fontSize: "12px", color: "var(--color-text-muted)" }}>24h</span>
            </div>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
            {data.lastSyncedAt ? `Synced ${formatRelativeTime(data.lastSyncedAt)}` : "Never synced"}
          </p>
        </div>
      </div>

      {/* Asset count summary */}
      <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-6)", paddingTop: "var(--space-6)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: 4 }}>Assets</p>
          <p style={{ fontSize: "18px", fontWeight: 700 }}>{data.assets.length}</p>
        </div>
        <div>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: 4 }}>Chains</p>
          <p style={{ fontSize: "18px", fontWeight: 700 }}>
            {new Set(data.assets.map((a) => a.chain)).size}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: 4 }}>Top Asset</p>
          <p style={{ fontSize: "18px", fontWeight: 700 }}>
            {data.assets.reduce((top, a) => a.totalValueUsd > top.totalValueUsd ? a : top, data.assets[0])?.symbol ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
