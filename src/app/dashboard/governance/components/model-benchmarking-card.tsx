import { Card } from "@/components/ui/card";
import { formatCostPerResponse, formatLatency } from "../helpers";
import type { ModelBenchmarkRow } from "../types";

type ModelBenchmarkingCardProps = {
  rows: ModelBenchmarkRow[];
};

export function ModelBenchmarkingCard({ rows }: ModelBenchmarkingCardProps) {
  const bestFaithfulnessValues = rows
    .map((r) => r.faithfulness)
    .filter((v): v is number => v !== null);
  const bestLatencyValues = rows
    .map((r) => r.latencyMs)
    .filter((v): v is number => v !== null);
  const bestCostValues = rows
    .map((r) => r.costUsd)
    .filter((v): v is number => v !== null);

  const bestFaithfulness = bestFaithfulnessValues.length
    ? Math.max(...bestFaithfulnessValues)
    : null;
  const bestLatency = bestLatencyValues.length
    ? Math.min(...bestLatencyValues)
    : null;
  const bestCost = bestCostValues.length ? Math.min(...bestCostValues) : null;

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
          Model Benchmarking
        </h2>
        <p className="mt-1 text-xs text-slate-300/75">
          Side-by-side model KPI scaffold (LangSmith eval wiring to follow).
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">
            Benchmark comparison of model faithfulness, latency, and cost per
            response.
          </caption>
          <thead className="bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-300/80">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Model
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Faithfulness
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Avg. Latency
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Cost / Response
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const faithfulnessWinner =
                row.faithfulness !== null && bestFaithfulness !== null
                  ? row.faithfulness === bestFaithfulness
                  : false;
              const latencyWinner =
                row.latencyMs !== null && bestLatency !== null
                  ? row.latencyMs === bestLatency
                  : false;
              const costWinner =
                row.costUsd !== null && bestCost !== null
                  ? row.costUsd === bestCost
                  : false;

              return (
                <tr
                  key={row.model}
                  className="border-t border-white/10 bg-slate-900/30 text-slate-100/90"
                >
                  <td className="px-4 py-3 font-semibold text-slate-100">
                    {row.model}
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono">
                        {row.faithfulness !== null
                          ? row.faithfulness.toFixed(2)
                          : "--"}
                      </span>
                      {faithfulnessWinner && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                          WINNER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono">
                        {formatLatency(row.latencyMs)}
                      </span>
                      {latencyWinner && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                          WINNER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono">
                        {formatCostPerResponse(row.costUsd)}
                      </span>
                      {costWinner && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                          WINNER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        row.status === "active"
                          ? "border-sky-400/30 bg-sky-500/10 text-sky-200"
                          : "border-white/15 bg-slate-900/40 text-slate-300"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
