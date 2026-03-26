"use client";

import Link from "next/link";
import { Brain, FileText, MessageCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { PDFUploader } from "@/components/pdf-uploader";
import { ChatInterface, type JudgeAudit } from "@/components/chat-interface";
import { useSessionId } from "@/hooks/use-session-id";

// LocalStorage keys shared with governance dashboard
const AUDIT_STATS_KEY = "sentinel-audit-stats";
const INGESTED_KEY = "sentinel-docs-ingested";
const JUDGE_HISTORY_KEY = "sentinel-judge-history";

function readJudgeHistory(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JUDGE_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n) => typeof n === "number" && n >= 0 && n <= 1);
  } catch {
    return [];
  }
}

// Dynamic import to avoid hydration mismatch for SecurityStatus
const SecurityStatus = dynamic(
  () =>
    import("@/components/security-status").then((mod) => mod.SecurityStatus),
  { ssr: false },
);

export default function Home() {
  const sessionId = useSessionId();
  const [chatKey, setChatKey] = useState(0);

  // Shared security state hydrated from localStorage
  const [isIngested, setIsIngested] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(INGESTED_KEY) === "true";
    }
    return false;
  });

  const [securityStats, setSecurityStats] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(AUDIT_STATS_KEY);
      try {
        return saved
          ? JSON.parse(saved)
          : { emails: 0, phones: 0, cards: 0, ssns: 0 };
      } catch {
        return { emails: 0, phones: 0, cards: 0, ssns: 0 };
      }
    }
    return { emails: 0, phones: 0, cards: 0, ssns: 0 };
  });

  const [judgeAudit, setJudgeAudit] = useState<JudgeAudit | null>(null);

  // Persist rolling judge score history (last 10) for governance heatmap
  useEffect(() => {
    if (!judgeAudit || typeof window === "undefined") return;

    const current = readJudgeHistory();
    const next = [...current, judgeAudit.score].slice(-10);
    localStorage.setItem(JUDGE_HISTORY_KEY, JSON.stringify(next));
  }, [judgeAudit]);

  const handlePurgeVault = async () => {
    if (
      !confirm(
        "⚠️ DECOMMISSION PROTOCOL: This will permanently nuke all cloud context. Proceed?",
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/rag/purge", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error("Cloud purge failed");

      // Clear local session memory
      localStorage.removeItem(AUDIT_STATS_KEY);
      localStorage.removeItem(INGESTED_KEY);
      localStorage.removeItem(JUDGE_HISTORY_KEY);

      // Reset UI state
      setSecurityStats({ emails: 0, phones: 0, cards: 0, ssns: 0 });
      setIsIngested(false);
      setJudgeAudit(null);
      setChatKey((prev) => prev + 1);
    } catch (error) {
      console.error("Purge Error:", error);
    }
  };

  // Persist security stats while ingested
  useEffect(() => {
    if (isIngested && typeof window !== "undefined") {
      localStorage.setItem(AUDIT_STATS_KEY, JSON.stringify(securityStats));
      localStorage.setItem(INGESTED_KEY, "true");
    }
  }, [securityStats, isIngested]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,transparent_55%),radial-gradient(circle_at_bottom,#022c22,#022c22)] text-foreground font-sans selection:bg-emerald-500/30">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <main className="relative z-10 flex min-h-screen max-w-6xl flex-col gap-8 ml-32 px-6 py-10 md:py-12">
        {/* Header */}
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40">
              <Brain className="size-3.5" />
            </span>
            <span className="text-sky-100/80 font-semibold tracking-tight">
              Sentinel Docs
            </span>
            <span className="h-1 w-1 rounded-full bg-sky-300/70" />
            <span className="text-slate-200/80 uppercase tracking-tighter text-[10px]">
              Zero-Trust Document Vault
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300/80">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-100 shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(34,197,94,0.35)]" />
              <span>Live Secure RAG Shell</span>
            </div>

            <Link
              href="/dashboard/governance"
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-medium text-sky-100 shadow-sm backdrop-blur transition-colors hover:bg-sky-500/20"
            >
              <ShieldCheck className="size-3.5 text-sky-300" />
              <span>Governance Dashboard</span>
            </Link>
          </div>
        </header>
        {/* Grid layout */}
        <section className="grid flex-1 gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)]">
          {/* Sidebar section */}
          <article className="relative flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 shadow-sm ring-1 ring-white/10">
                <FileText className="size-3.5 text-sky-300" />
                <span>Secure workspace</span>
              </div>

              <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-50 md:text-3xl leading-snug">
                Analyze sensitive documents with{" "}
                <span className="text-emerald-400">privacy-first</span> AI.
              </h1>

              <p className="max-w-md text-sm text-slate-300/80 leading-relaxed">
                Ingest assets once, then ask precise, auditable questions
                powered by retrieval-augmented generation.
              </p>

              <div className="pt-2">
                <PDFUploader
                  onIngestSuccess={(stats) => {
                    setSecurityStats(stats);
                    setIsIngested(true);
                  }}
                />
              </div>
            </div>

            {/* Security command widget */}
            <div className="mt-8 transition-all duration-500 ease-in-out">
              <SecurityStatus
                stats={securityStats}
                isIngested={isIngested}
                onPurge={handlePurgeVault}
                judge={judgeAudit}
              />
            </div>
          </article>

          {/* Chat section */}
          <article className="relative flex min-h-[460px] flex-col rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/70 via-slate-950/80 to-slate-900/90 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.4),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200/90 ring-1 ring-white/10">
                <MessageCircle className="size-3.5 text-violet-300" />
                <span>Secure Document Chat</span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-300/70 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(34,197,94,0.35)]" />
                <span>GPT-4O-MINI · UPSTASH RAG</span>
              </div>
            </div>

            {/* Force reset on purge */}
            <ChatInterface key={chatKey} onAudit={setJudgeAudit} />
          </article>
        </section>
      </main>
    </div>
  );
}
