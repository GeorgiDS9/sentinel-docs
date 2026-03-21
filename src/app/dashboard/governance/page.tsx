"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileDown,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";

// LocalStorage keys shared with home/chat
const AUDIT_STATS_KEY = "sentinel-audit-stats";
const JUDGE_HISTORY_KEY = "sentinel-judge-history";
const SESSION_ID_KEY = "sentinel-docs-session-id";

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

// Zod schemas
const AuditStatsSchema = z.object({
  emails: z.number().int().nonnegative(),
  phones: z.number().int().nonnegative(),
  cards: z.number().int().nonnegative(),
  ssns: z.number().int().nonnegative(),
});

const JudgeHistorySchema = z.array(z.number().min(0).max(1));

// Types
type AuditStats = z.infer<typeof AuditStatsSchema>;
type HealthStatus = "COMPLIANT" | "REVIEW" | "VIOLATION";

// Defaults
const EMPTY_STATS: AuditStats = { emails: 0, phones: 0, cards: 0, ssns: 0 };

// Heatmap color thresholds
function getHeatColor(score: number): string {
  if (score >= 0.9) return "bg-emerald-400/80 ring-emerald-300/60";
  if (score >= 0.7) return "bg-amber-400/80 ring-amber-300/60";
  return "bg-rose-400/80 ring-rose-300/60";
}

function getHealthStatus(scores: number[]): HealthStatus {
  if (scores.length === 0) return "REVIEW";
  if (scores.some((s) => s < 0.7)) return "VIOLATION";
  if (scores.some((s) => s < 0.9)) return "REVIEW";
  return "COMPLIANT";
}

function getHealthPillClass(status: HealthStatus): string {
  if (status === "COMPLIANT") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  }
  if (status === "VIOLATION") {
    return "border-rose-400/30 bg-rose-500/10 text-rose-200";
  }
  return "border-amber-400/30 bg-amber-500/10 text-amber-200";
}

function getHealthHint(status: HealthStatus, sampleCount: number): string {
  if (sampleCount === 0) {
    return "Insufficient evidence: run additional Q&A to establish a reliability baseline.";
  }
  if (status === "COMPLIANT") {
    return "All recent judge scores are in the compliant range.";
  }
  if (status === "VIOLATION") {
    return "At least one recent interaction entered violation range and needs review.";
  }
  return "Recent interactions indicate mixed reliability and require monitoring.";
}

export default function GovernanceDashboardPage() {
  const [stats, setStats] = useState<AuditStats>(EMPTY_STATS);
  const [judgeHistory, setJudgeHistory] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

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

    const readSessionId = () => {
      const id = localStorage.getItem(SESSION_ID_KEY) ?? "";
      setSessionId(id);
    };

    readAuditStats();
    readJudgeHistory();
    readSessionId();

    const onStorage = (event: StorageEvent) => {
      if (event.key === AUDIT_STATS_KEY || event.key === null) readAuditStats();
      if (event.key === JUDGE_HISTORY_KEY || event.key === null)
        readJudgeHistory();
      if (event.key === SESSION_ID_KEY || event.key === null) readSessionId();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totalBlocked = useMemo(
    () => stats.emails + stats.phones + stats.cards + stats.ssns,
    [stats],
  );

  const latestScore =
    judgeHistory.length > 0 ? judgeHistory[judgeHistory.length - 1] : null;

  const averageScore = useMemo(() => {
    if (judgeHistory.length === 0) return null;
    const sum = judgeHistory.reduce((acc, s) => acc + s, 0);
    return sum / judgeHistory.length;
  }, [judgeHistory]);

  const healthStatus = useMemo(
    () => getHealthStatus(judgeHistory),
    [judgeHistory],
  );

  const healthHint = useMemo(
    () => getHealthHint(healthStatus, judgeHistory.length),
    [healthStatus, judgeHistory.length],
  );

  // Session-aware LangSmith deep link
  const langsmithTraceUrl = useMemo(() => {
    const sid = encodeURIComponent(sessionId || "");
    const overrideBase = process.env.NEXT_PUBLIC_LANGSMITH_TRACE_BASE;
    if (overrideBase && sid) {
      return `${overrideBase}${sid}`;
    }
    return sid
      ? `https://smith.langchain.com/traces?search=${sid}`
      : "https://smith.langchain.com/traces";
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,transparent_55%),radial-gradient(circle_at_bottom,#022c22,#022c22)] text-foreground font-sans selection:bg-emerald-500/30">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <main className="container relative z-10 flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40">
                <ShieldCheck className="size-3.5" />
              </span>
              <span className="text-sky-100/80 font-semibold tracking-tight">
                Compliance Command Center
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-100 shadow-sm backdrop-blur transition-colors hover:bg-sky-500/20"
            >
              <ArrowLeft className="size-3.5 text-sky-300" />
              <span>Back to Secure RAG Shell</span>
            </Link>
          </div>

          <div className="space-y-3">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
              NIST AI RMF Governance Dashboard
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed text-slate-300/80">
              Real-time trust evidence layer mapping Sentinel Docs controls to
              Govern, Map, Measure, and Manage requirements.
            </p>
          </div>
        </header>

        {/* Compliance health summary */}
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
                {judgeHistory.length}
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
        <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr]">
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

          {/* Audit actions */}
          <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                  Audit Actions
                </h2>
                <p className="mt-1 text-xs text-slate-300/75">
                  Open session trace evidence and export compliance report
                  artifacts.
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Session:{" "}
                  <span className="font-mono text-slate-300">
                    {sessionId || "No active session"}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <a
                  href={langsmithTraceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur transition-colors ${
                    sessionId
                      ? "border-sky-400/30 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20"
                      : "border-white/15 bg-slate-900/40 text-slate-400 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open LangSmith Trace</span>
                </a>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-200/60 shadow-sm backdrop-blur cursor-not-allowed"
                  title="Coming soon"
                >
                  <FileDown className="size-3.5" />
                  <span>Compliance Export (Coming soon)</span>
                </button>
              </div>
            </div>
          </Card>
        </div>

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
