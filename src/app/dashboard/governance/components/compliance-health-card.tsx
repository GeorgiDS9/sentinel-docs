import { Card } from "@/components/ui/card";
import { getHealthPillClass } from "../helpers";
import type { HealthStatus } from "../types";

type ComplianceHealthCardProps = {
  healthHint: string;
  healthStatus: HealthStatus;
  judgeSampleSize: number;
  latestScore: number | null;
  averageScore: number | null;
};

export function ComplianceHealthCard({
  healthHint,
  healthStatus,
  judgeSampleSize,
  latestScore,
  averageScore,
}: ComplianceHealthCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Compliance Health
          </h2>
          <p className="mt-1 text-xs text-slate-300/80">{healthHint}</p>
        </div>

        <div
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${getHealthPillClass(
            healthStatus,
          )}`}
        >
          {healthStatus}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Sample Size
          </p>
          <p className="mt-1 text-lg font-bold font-mono text-slate-100">
            {judgeSampleSize}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Latest Judge Score
          </p>
          <p className="mt-1 text-lg font-bold font-mono text-slate-100">
            {latestScore !== null ? latestScore.toFixed(2) : "--"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Average (Last 10)
          </p>
          <p className="mt-1 text-lg font-bold font-mono text-slate-100">
            {averageScore !== null ? averageScore.toFixed(2) : "--"}
          </p>
        </div>
      </div>
    </Card>
  );
}
