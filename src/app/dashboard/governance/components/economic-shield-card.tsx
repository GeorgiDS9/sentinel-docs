import { Card } from "@/components/ui/card";
import { formatUsd } from "../helpers";
import type { SessionUsage } from "../types";

type EconomicShieldCardProps = {
  usage: SessionUsage;
  totalTokens: number;
  estimatedSessionCost: number;
  costToIntelligenceEfficiency: number | null;
};

export function EconomicShieldCard({
  usage,
  totalTokens,
  estimatedSessionCost,
  costToIntelligenceEfficiency,
}: EconomicShieldCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Economic Shield Metrics
          </h2>
          <p className="mt-1 text-xs text-slate-300/75">
            Session token and cost telemetry (UI scaffold; LangSmith wiring
            follows).
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-200">
          GPT-4o-mini
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Total Tokens Consumed
          </p>
          <p className="mt-1 text-lg font-bold font-mono text-slate-100">
            {totalTokens.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            In: {usage.promptTokens.toLocaleString()} / Out:{" "}
            {usage.completionTokens.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Estimated Session Cost
          </p>
          <p className="mt-1 text-lg font-bold font-mono text-slate-100">
            {formatUsd(estimatedSessionCost)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Pricing: $0.15/M input - $0.60/M output
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Cost-to-Intelligence Efficiency
          </p>
          <p className="mt-1 text-lg font-bold font-mono text-slate-100">
            {costToIntelligenceEfficiency !== null
              ? `${costToIntelligenceEfficiency.toFixed(2)}%`
              : "--"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {costToIntelligenceEfficiency !== null
              ? "Score-adjusted efficiency vs target cost budget"
              : "Awaiting judged response to compute efficiency"}
          </p>
        </div>
      </div>
    </Card>
  );
}
