import type { HealthStatus } from "./types";

export function getHeatColor(score: number): string {
  if (score >= 0.9) return "bg-emerald-400/80 ring-emerald-300/60";
  if (score >= 0.7) return "bg-amber-400/80 ring-amber-300/60";
  return "bg-rose-400/80 ring-rose-300/60";
}

export function getHealthStatus(scores: number[]): HealthStatus {
  if (scores.length === 0) return "BASELINING";
  if (scores.some((s) => s < 0.7)) return "VIOLATION";
  if (scores.some((s) => s < 0.9)) return "REVIEW";
  return "COMPLIANT";
}

export function getHealthPillClass(status: HealthStatus): string {
  if (status === "COMPLIANT") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  }
  if (status === "VIOLATION") {
    return "border-rose-400/30 bg-rose-500/10 text-rose-200";
  }
  if (status === "BASELINING") {
    return "border-slate-400/30 bg-slate-500/10 text-slate-200";
  }
  return "border-amber-400/30 bg-amber-500/10 text-amber-200";
}

export function getHealthHint(
  status: HealthStatus,
  sampleCount: number,
): string {
  if (sampleCount === 0) {
    return "No audit evidence yet: run Q&A in Secure RAG Shell to generate baseline scores.";
  }
  if (status === "COMPLIANT") {
    return "All recent judge scores are in the compliant range.";
  }
  if (status === "VIOLATION") {
    return "At least one recent interaction entered violation range and needs review.";
  }
  return "Recent interactions indicate mixed reliability and require monitoring.";
}

export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function formatLatency(ms: number | null): string {
  if (ms === null) return "--";
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatCostPerResponse(cost: number | null): string {
  if (cost === null) return "--";
  return `$${cost.toFixed(4)}`;
}
