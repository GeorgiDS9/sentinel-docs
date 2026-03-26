"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AUDIT_STATS_KEY,
  benchmarkRows,
  complianceRows,
  EMPTY_STATS,
  EMPTY_USAGE,
  JUDGE_HISTORY_KEY,
  OPENAI_GPT4O_MINI_INPUT_PER_M,
  OPENAI_GPT4O_MINI_OUTPUT_PER_M,
  SESSION_COST_KEY,
  SESSION_ID_KEY,
  TARGET_COST_USD_PER_RESPONSE,
} from "./constants";
import { getHealthHint, getHealthStatus } from "./helpers";
import type { AuditStats, SessionUsage } from "./types";
import { AuditStatsSchema, JudgeHistorySchema } from "./validation";
import { ComplianceHealthCard } from "./components/compliance-health-card";
import { EconomicShieldCard } from "./components/economic-shield-card";
import { ModelBenchmarkingCard } from "./components/model-benchmarking-card";
import { ComplianceMatrixCard } from "./components/compliance-matrix-card";
import { RedactionCounterCard } from "./components/redaction-counter-card";
import { AuditActionsCard } from "./components/audit-actions-card";
import { IntegrityHeatmapCard } from "./components/integrity-heatmap-card";

export default function GovernanceDashboardPage() {
  const [stats, setStats] = useState<AuditStats>(EMPTY_STATS);
  const [judgeHistory, setJudgeHistory] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [usage, setUsage] = useState<SessionUsage>(EMPTY_USAGE);

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

    const readSessionUsage = () => {
      try {
        const raw = localStorage.getItem(SESSION_COST_KEY);
        if (!raw) {
          setUsage(EMPTY_USAGE);
          return;
        }

        const parsed = JSON.parse(raw) as Partial<SessionUsage> | null;
        const promptTokens =
          typeof parsed?.promptTokens === "number" && parsed.promptTokens >= 0
            ? parsed.promptTokens
            : 0;
        const completionTokens =
          typeof parsed?.completionTokens === "number" &&
          parsed.completionTokens >= 0
            ? parsed.completionTokens
            : 0;

        setUsage({ promptTokens, completionTokens });
      } catch {
        setUsage(EMPTY_USAGE);
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
    readSessionUsage();
    readJudgeHistory();
    readSessionId();

    const onStorage = (event: StorageEvent) => {
      if (event.key === AUDIT_STATS_KEY || event.key === null) readAuditStats();
      if (event.key === JUDGE_HISTORY_KEY || event.key === null)
        readJudgeHistory();
      if (event.key === SESSION_ID_KEY || event.key === null) readSessionId();
      if (event.key === SESSION_COST_KEY || event.key === null)
        readSessionUsage();
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

  const totalTokens = usage.promptTokens + usage.completionTokens;

  const estimatedSessionCost = useMemo(() => {
    const inputCost =
      (usage.promptTokens / 1_000_000) * OPENAI_GPT4O_MINI_INPUT_PER_M;
    const outputCost =
      (usage.completionTokens / 1_000_000) * OPENAI_GPT4O_MINI_OUTPUT_PER_M;
    return inputCost + outputCost;
  }, [usage.promptTokens, usage.completionTokens]);

  const hasJudgeEvidence = latestScore !== null;

  const costToIntelligenceEfficiency = useMemo(() => {
    if (!hasJudgeEvidence || estimatedSessionCost <= 0) return null;

    const score = latestScore;
    const costFactor = Math.min(
      1,
      TARGET_COST_USD_PER_RESPONSE / estimatedSessionCost,
    );
    const efficiency = score * costFactor * 100;

    return Math.max(0, Math.min(100, efficiency));
  }, [hasJudgeEvidence, latestScore, estimatedSessionCost]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,transparent_55%),radial-gradient(circle_at_bottom,#022c22,#022c22)] text-foreground font-sans selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <main className="relative z-10 flex min-h-screen max-w-6xl flex-col gap-6 ml-32 px-4 py-10 md:py-12">
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
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-100 shadow-sm backdrop-blur transition-colors hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
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
        <ComplianceHealthCard
          healthHint={healthHint}
          healthStatus={healthStatus}
          judgeSampleSize={judgeHistory.length}
          latestScore={latestScore}
          averageScore={averageScore}
        />
        <ComplianceMatrixCard rows={complianceRows} />
        <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr]">
          <RedactionCounterCard totalBlocked={totalBlocked} />

          <AuditActionsCard
            sessionId={sessionId}
            langsmithTraceUrl={langsmithTraceUrl}
          />
        </div>
        <IntegrityHeatmapCard judgeHistory={judgeHistory} />
        <EconomicShieldCard
          usage={usage}
          totalTokens={totalTokens}
          estimatedSessionCost={estimatedSessionCost}
          costToIntelligenceEfficiency={costToIntelligenceEfficiency}
        />
        <ModelBenchmarkingCard rows={benchmarkRows} />
      </main>
    </div>
  );
}
