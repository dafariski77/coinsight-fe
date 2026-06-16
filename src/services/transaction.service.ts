import apiClient from "@/lib/api";
import type { EnrichedTransaction, TransactionFilters } from "@/types";

/** Real backend response shape from GET /transactions/:userId */
export interface TransactionApiResponse {
  data: EnrichedTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number; // backend uses totalPages, not hasNextPage
}

export const transactionService = {
  async getTransactions(
    userId: string,
    filters: TransactionFilters = {}
  ): Promise<TransactionApiResponse> {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
    };
    if (filters.type) params.type = filters.type;

    const { data } = await apiClient.get<TransactionApiResponse>(
      `/transactions/${userId}`,
      { params }
    );
    return data;
  },
};
