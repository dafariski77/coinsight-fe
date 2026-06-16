"use client";

import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolio.service";
import { useAuthStore } from "@/store/auth.store";

export function usePortfolioSummary() {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: () => portfolioService.getSummary(user!.id),
    enabled: isAuthenticated && !!user?.id,
    refetchInterval: 60 * 1000, // auto-refetch every 60s
    staleTime: 30 * 1000,
  });
}
