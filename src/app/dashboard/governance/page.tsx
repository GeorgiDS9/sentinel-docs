"use client";

import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";

// LocalStorage keys shared with home/chat
const AUDIT_STATS_KEY = "sentinel-audit-stats";
const JUDGE_HISTORY_KEY = "sentinel-judge-history";

// Static compliance matrix data
const complianceRows = [
  {
    function: "GOVERN (GV)",
    requirement: "Accountability & Transparency",
    evidence: "LangSmith Traces",
    detail: "Immutable audit trail of every interaction.",
  },
  {
    function: "MAP (MP)",
    requirement: "Contextualizing AI Use Cases",
    evidence: "Upstash Namespaces",
    detail: "Isolated session-level document context.",
  },
  {
    function: "MEASURE (MS)",
    requirement: "Assessing System Trustworthiness",
    evidence: "LLM-as-a-Judge",
    detail: "Real-time faithfulness and grounding scores.",
  },
  {
    function: "MANAGE (MG)",
    requirement: "Prioritizing & Acting on Risks",
    evidence: "Upstash Redis + Sentinel Guard DLP",
    detail: "Edge rate limiting and redaction trigger controls.",
  },
];

// Zod schema for redaction stats
const AuditStatsSchema = z.object({
  emails: z.number().int().nonnegative(),
  phones: z.number().int().nonnegative(),
  cards: z.number().int().nonnegative(),
  ssns: z.number().int().nonnegative(),
});

// Zod schema for judge score history (last 10)
const JudgeHistorySchema = z.array(z.number().min(0).max(1));

type AuditStats = z.infer<typeof AuditStatsSchema>;
const EMPTY_STATS: AuditStats = { emails: 0, phones: 0, cards: 0, ssns: 0 };

// Heatmap color thresholds
function getHeatColor(score: number): string {
  if (score >= 0.9) return "bg-emerald-400/80 ring-emerald-300/60";
  if (score >= 0.7) return "bg-amber-400/80 ring-amber-300/60";
  return "bg-rose-400/80 ring-rose-300/60";
}

export default function GovernanceDashboardPage() {
  // Redaction stats state
  const [stats, setStats] = useState<AuditStats>(EMPTY_STATS);

  // Judge history state (live)
  const [judgeHistory, setJudgeHistory] = useState<number[]>([]);

  useEffect(() => {
    const readAuditStats = () => {
      try {
        const raw = localStorage.getItem(AUDIT_STATS_KEY);
        if (!raw) {
          setStats(EMPTY_STATS);
          return;
        }

        const parsed = AuditStatsSchema.safeParse(JSON.parse(raw));
        setStats(parsed.success ? parsed.data : EMPTY_STATS);
      } catch {
        setStats(EMPTY_STATS);
      }
    };

    const readJudgeHistory = () => {
      try {
        const raw = localStorage.getItem(JUDGE_HISTORY_KEY);
        if (!raw) {
          setJudgeHistory([]);
          return;
        }

        const parsed = JudgeHistorySchema.safeParse(JSON.parse(raw));
        setJudgeHistory(parsed.success ? parsed.data.slice(-10) : []);
      } catch {
        setJudgeHistory([]);
      }
    };

    // Load once on mount
    readAuditStats();
    readJudgeHistory();

    // Sync updates from other tabs/windows
    const onStorage = (event: StorageEvent) => {
      if (event.key === AUDIT_STATS_KEY || event.key === null) {
        readAuditStats();
      }
      if (event.key === JUDGE_HISTORY_KEY || event.key === null) {
        readJudgeHistory();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totalBlocked = useMemo(
    () => stats.emails + stats.phones + stats.cards + stats.ssns,
    [stats],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,transparent_55%),radial-gradient(circle_at_bottom,#022c22,#022c22)] text-foreground font-sans selection:bg-emerald-500/30">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <main className="container relative z-10 flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        {/* Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40">
              <ShieldCheck className="size-3.5" />
            </span>
            <span className="text-sky-100/80 font-semibold tracking-tight">
              Compliance Command Center
            </span>
          </div>

          <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
            NIST AI RMF Governance Dashboard
          </h1>

          <p className="max-w-3xl text-sm leading-relaxed text-slate-300/80">
            Real-time trust evidence layer mapping Sentinel Docs controls to
            Govern, Map, Measure, and Manage requirements.
          </p>
        </header>

        {/* Compliance health placeholder */}
        <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Compliance Health
            </h2>
            <p className="text-sm text-slate-300/80">
              Initializing audit evidence widgets...
            </p>
          </div>
        </Card>

        {/* Compliance matrix */}
        <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Compliance Matrix
            </h2>
            <p className="mt-1 text-xs text-slate-300/75">
              Static NIST AI RMF alignment map for Sentinel controls.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-300/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">NIST Function</th>
                  <th className="px-4 py-3 font-semibold">Requirement</th>
                  <th className="px-4 py-3 font-semibold">Evidence</th>
                  <th className="px-4 py-3 font-semibold">Audit Detail</th>
                </tr>
              </thead>
              <tbody>
                {complianceRows.map((row) => (
                  <tr
                    key={row.function}
                    className="border-t border-white/10 bg-slate-900/30 text-slate-100/90"
                  >
                    <td className="px-4 py-3 font-semibold text-emerald-300">
                      {row.function}
                    </td>
                    <td className="px-4 py-3 text-slate-200/90">
                      {row.requirement}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-200">
                        {row.evidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300/85">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Redaction counter */}
        <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Redaction Counter
              </h2>
              <p className="mt-1 text-xs text-slate-300/75">
                Total PII patterns blocked in the active session.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2">
              <ShieldAlert className="size-4 text-amber-300" />
              <span className="text-lg font-bold font-mono text-amber-300">
                {totalBlocked}
              </span>
            </div>
          </div>
        </Card>

        {/* Integrity heatmap (live) */}
        <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Integrity Heatmap
            </h2>
            <p className="mt-1 text-xs text-slate-300/75">
              Visual summary of the last 10 Judge scores from this browser
              session.
            </p>
          </div>

          {judgeHistory.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-xs text-slate-300/80">
              No judge history yet. Ask a few questions in the chat to populate
              this heatmap.
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
      </main>
    </div>
  );
}
