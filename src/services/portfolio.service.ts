import apiClient from "@/lib/api";
import type { PortfolioSummary } from "@/types";

export const portfolioService = {
  async getSummary(userId: string): Promise<PortfolioSummary> {
    const { data } = await apiClient.get<PortfolioSummary>(
      `/portfolio/${userId}`
    );
    return data;
  },
};
