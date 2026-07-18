import { apiFetch } from "./client";
import type { AnalyzeResponse } from "./types";

export function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  return apiFetch<AnalyzeResponse>("/api/v1/analyzer/analyze", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
