import { Card } from "@/components/ui/card";
import { getHeatColor } from "../helpers";

type IntegrityHeatmapCardProps = {
  judgeHistory: number[];
};

export function IntegrityHeatmapCard({
  judgeHistory,
}: IntegrityHeatmapCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
          Integrity Heatmap
        </h2>
        <p className="mt-1 text-xs text-slate-300/75">
          Visual summary of the last 10 Judge scores from this browser session.
        </p>
      </div>

      {judgeHistory.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-xs text-slate-300/80">
          No judge history yet. Ask a few questions in the chat to populate this
          heatmap.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {judgeHistory.map((score, index) => (
            <div
              key={`${score}-${index}`}
              className={`rounded-md border border-white/10 p-2 text-center ring-1 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:ring-2 ${getHeatColor(score)}`}
              title={`Run #${index + 1} - score ${score.toFixed(2)}`}
            >
              <div className="text-[10px] font-mono font-semibold text-slate-950">
                {score.toFixed(2)}
              </div>
              <span className="sr-only">
                {score >= 0.9
                  ? "Compliant"
                  : score >= 0.7
                    ? "Review"
                    : "Violation"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-300/85">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-400" />
          Compliant (&gt;= 0.90)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-400" />
          Review (0.70 - 0.89)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-rose-400" />
          Violation (&lt; 0.70)
        </span>
      </div>
    </Card>
  );
}
