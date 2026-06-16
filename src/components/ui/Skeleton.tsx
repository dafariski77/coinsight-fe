"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "16px", borderRadius, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card card-padding" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton height="12px" width="40%" />
      <Skeleton height="32px" width="60%" />
      <Skeleton height="12px" width="30%" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr auto", gap: 16, padding: "16px 24px", alignItems: "center" }}>
      <Skeleton height="22px" width="80px" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton height="14px" width="120px" />
        <Skeleton height="11px" width="80px" />
      </div>
      <Skeleton height="14px" width="100px" />
      <Skeleton height="11px" width="60px" />
    </div>
  );
}
