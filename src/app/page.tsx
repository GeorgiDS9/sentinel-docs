"use client";

import { Brain, FileText, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { PDFUploader } from "@/components/pdf-uploader";
import { ChatInterface, type JudgeAudit } from "@/components/chat-interface";
import { useSessionId } from "@/hooks/use-session-id"; // 🛡️ 1. Import Session ID Hook

// 🛡️ ARCHITECT'S MOVE: Dynamic Import with SSR disabled
// This kills the hydration mismatch and the "cascading render" error for good.
const SecurityStatus = dynamic(
  () =>
    import("@/components/security-status").then((mod) => mod.SecurityStatus),
  { ssr: false },
);

export default function Home() {
  const sessionId = useSessionId(); // 🛡️ 2. Initialize Session ID
  const [chatKey, setChatKey] = useState(0); // 🛡️ 3. Key to force-reset the Chat UI on purge

  // 🛡️ SHARED SECURITY STATE (Lazy Initializer Pattern)
  // Hydrates state directly from LocalStorage to prevent flicker.
  const [isIngested, setIsIngested] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sentinel-docs-ingested") === "true";
    }
    return false;
  });

  const [securityStats, setSecurityStats] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sentinel-audit-stats");
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

  // 🛡️ 4. THE KILL SWITCH LOGIC (Decommissioning Protocol)
  const handlePurgeVault = async () => {
    if (
      !confirm(
        "⚠️ DECOMMISSION PROTOCOL: This will permanently nuke all cloud context. Proceed?",
      )
    ) {
      return;
    }

    try {
      // THE CLOUD WIPE: Call the Purge API
      const response = await fetch("/api/rag/purge", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error("Cloud purge failed");

      // THE LOCAL WIPE: Reset browser memory
      localStorage.removeItem("sentinel-audit-stats");
      localStorage.removeItem("sentinel-docs-ingested");

      // THE UI RESET: Zero out stats and flip flags
      setSecurityStats({ emails: 0, phones: 0, cards: 0, ssns: 0 });
      setIsIngested(false);

      // Clear judge evidence on purge
      setJudgeAudit(null);

      // THE CHAT RESET: Incrementing this key forces the ChatInterface to re-mount fresh
      setChatKey((prev) => prev + 1);
    } catch (error) {
      console.error("Purge Error:", error);
    }
  };

  // 🛡️ PERSISTENCE: Sync state to LocalStorage whenever it changes
  // No more loading logic here = No more "Cascading Render" warnings.
  useEffect(() => {
    if (isIngested && typeof window !== "undefined") {
      localStorage.setItem(
        "sentinel-audit-stats",
        JSON.stringify(securityStats),
      );
      localStorage.setItem("sentinel-docs-ingested", "true");
    }
  }, [securityStats, isIngested]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,transparent_55%),radial-gradient(circle_at_bottom,#022c22,#022c22)] text-foreground font-sans selection:bg-emerald-500/30">
      {/* 🌌 Background Gradients */}
      <div className="pointer-events-none fixed inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <main className="container relative z-10 flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
        {/* 🏷️ Header */}
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

          <div className="flex items-center gap-3 text-xs text-slate-300/80">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-100 shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(34,197,94,0.35)]" />
              <span>Live Secure RAG Shell</span>
            </div>
          </div>
        </header>

        {/* 🧱 Grid Layout */}
        <section className="grid flex-1 gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)]">
          {/* 🛡️ Sidebar Section */}
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

            {/* 🛡️ THE COMMAND CENTER WIDGET */}
            <div className="mt-8 transition-all duration-500 ease-in-out">
              {/* 🛡️ 5. Pass the purge handler to the component */}
              <SecurityStatus
                stats={securityStats}
                isIngested={isIngested}
                onPurge={handlePurgeVault}
                judge={judgeAudit}
              />
            </div>
          </article>

          {/* 💬 Chat Section */}
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

            {/* Using 'key' forces a full component reset on Purge */}
            <ChatInterface key={chatKey} onAudit={setJudgeAudit} />
          </article>
        </section>
      </main>
    </div>
  );
}
