"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Asset } from "@/types";

interface AllocationChartProps {
  assets: Asset[];
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#7c3aed",
  "#4f46e5",
];

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: Asset }[] }) => {
  if (active && payload && payload.length) {
    const asset = payload[0].payload;
    return (
      <div style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-lg)",
      }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{asset.symbol}</p>
        <p style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{asset.chain}</p>
        <p style={{ fontSize: "14px", fontWeight: 600, marginTop: 4 }}>{formatUSD(asset.totalValueUsd)}</p>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{asset.allocationPercentage.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ assets }: { assets: Asset[] }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginLeft: "var(--space-4)" }}>
    {assets.map((asset, idx) => (
      <div key={asset.symbol} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS[idx % COLORS.length], flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{asset.symbol}</span>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              {asset.allocationPercentage.toFixed(1)}%
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
            {formatUSD(asset.totalValueUsd)}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export function AllocationChart({ assets }: AllocationChartProps) {
  const chartData = assets.map((asset) => ({
    ...asset,
    name: asset.symbol,
    value: asset.allocationPercentage,
  }));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend assets={assets} />
    </div>
  );
}
