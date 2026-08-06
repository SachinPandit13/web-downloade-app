import { apiClient } from "./client";
import type { AnalyzeResponse } from "./types";

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const response = await apiClient.post<AnalyzeResponse>(
    "/api/v1/analyzer/analyze",
    { url },
  );
  return response.data;
}
