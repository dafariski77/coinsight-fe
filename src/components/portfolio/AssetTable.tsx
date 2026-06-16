"use client";

import { ChainBadge } from "@/components/ui/Badge";
import type { Asset } from "@/types";

interface AssetTableProps {
  assets: Asset[];
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatBalance(balance: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(balance);
}

function TokenAvatar({ symbol, logoUrl }: { symbol: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <div className="token-icon">
        <img src={logoUrl} alt={symbol} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      </div>
    );
  }
  return (
    <div className="token-icon" aria-label={symbol}>
      {symbol.slice(0, 2)}
    </div>
  );
}

export function AssetTable({ assets }: AssetTableProps) {
  if (!assets.length) return null;

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="asset-table" aria-label="Asset allocation table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Chain</th>
            <th>Balance</th>
            <th>Price</th>
            <th>Value</th>
            <th>Allocation</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={`${asset.symbol}-${asset.chain}`}>
              <td>
                <div className="asset-row-token">
                  <TokenAvatar symbol={asset.symbol} logoUrl={asset.logoUrl} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{asset.symbol}</div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                      {asset.tokenMint.slice(0, 8)}…
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <ChainBadge chain={asset.chain} />
              </td>
              <td style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatBalance(asset.balance)}
              </td>
              <td style={{ color: "var(--color-text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                {formatUSD(asset.currentPriceUsd)}
              </td>
              <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {formatUSD(asset.totalValueUsd)}
              </td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div className="allocation-bar-container">
                    <div
                      className="allocation-bar"
                      style={{ width: `${asset.allocationPercentage}%` }}
                      role="progressbar"
                      aria-valuenow={asset.allocationPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", minWidth: "40px" }}>
                    {asset.allocationPercentage.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
