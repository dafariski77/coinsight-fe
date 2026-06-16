"use client";

import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { useAuthStore } from "@/store/auth.store";
import type { TransactionFilters } from "@/types";

export function useTransactions(filters: TransactionFilters = {}) {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["transactions", user?.id, filters],
    queryFn: () =>
      transactionService.getTransactions(user!.id, {
        page: filters.page,
        limit: filters.limit,
        type: filters.type,
        // walletAddress and token are client-side display filters only
        // the real backend only supports filtering by type
      }),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 15 * 1000,
  });
}
