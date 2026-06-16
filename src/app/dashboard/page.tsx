"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NetWorthCard } from "@/components/portfolio/NetWorthCard";
import { AllocationChart } from "@/components/portfolio/AllocationChart";
import { AssetTable } from "@/components/portfolio/AssetTable";
import { usePortfolioSummary } from "@/hooks/usePortfolio";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: portfolio, isLoading, isError, refetch } = usePortfolioSummary();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout title="Portfolio Dashboard">
      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title font-display">Your Portfolio</h2>
        <p className="page-subtitle">
          Real-time overview of your Web3 assets across all tracked wallets
        </p>
      </div>

      {/* Net Worth */}
      {isLoading ? (
        <div style={{ marginBottom: "var(--space-8)" }}>
          <Skeleton height="220px" borderRadius="var(--radius-xl)" />
        </div>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load portfolio"
          description="Could not fetch your portfolio data. Please try again."
          action={
            <button className="btn btn-primary" onClick={() => refetch()} id="retry-portfolio-btn">
              Retry
            </button>
          }
        />
      ) : portfolio ? (
        <>
          {/* Net Worth Card */}
          <div style={{ marginBottom: "var(--space-8)" }}>
            <NetWorthCard data={portfolio} />
          </div>

          {/* Charts + Stats */}
          {portfolio.assets.length > 0 && (
            <div className="chart-grid" style={{ marginBottom: "var(--space-8)" }}>
              {/* Allocation Chart */}
              <div className="card chart-container">
                <p className="chart-title">Allocation</p>
                <AllocationChart assets={portfolio.assets} />
              </div>

              {/* Top Holdings Table */}
              <div className="card chart-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <p className="chart-title">Holdings</p>
                  <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                    {portfolio.assets.length} assets
                  </span>
                </div>
                <AssetTable assets={portfolio.assets} />
              </div>
            </div>
          )}
        </>
      ) : null}
    </DashboardLayout>
  );
}
