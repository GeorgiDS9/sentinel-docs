"use client";

import { useEffect, useState, useRef } from "react";
import { z } from "zod";

import { useCompletion } from "@ai-sdk/react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import type { RetrievedChunk } from "@/lib/ai/rag-engine";
import { useSessionId } from "@/hooks/use-session-id";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const ScorecardResponseSchema = z.object({
  score: z.number().min(0).max(1),
  reasoning: z.string(),
  verdict: z.enum(["PASSED", "FAILED", "NEEDS_REVIEW"]),
});

export type JudgeVerdict = "PASSED" | "FAILED" | "NEEDS_REVIEW";
export type JudgeAudit = { verdict: JudgeVerdict; score: number };

type ScorecardResponse = z.infer<typeof ScorecardResponseSchema>;

export function ChatInterface({
  onAudit,
}: {
  onAudit?: (audit: JudgeAudit | null) => void;
}) {
  const sessionId = useSessionId();
  const { toast } = useToast();

  const [sources, setSources] = useState<RetrievedChunk[]>([]);
  const sourcesRef = useRef<RetrievedChunk[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const [lastAudit, setLastAudit] = useState<ScorecardResponse | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    error,
  } = useCompletion({
    api: "/api/chat",
    body: { sessionId },
    streamProtocol: "text",

    onFinish: async (prompt: string, completionText: string) => {
      // Post-response governance audit: evaluate grounding using the same retrieved context.
      const contextChunks = sourcesRef.current.map((s) => s.text);

      if (!contextChunks.length) {
        console.warn(
          "[Sentinel Audit] No context chunks available; skipping judge.",
        );
        return;
      }

      try {
        // Clear previous dashboard value immediately while the judge runs.
        onAudit?.(null);
        setIsAuditing(true);

        const res = await fetch("/api/admin/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            context: contextChunks,
            question: prompt,
            answer: completionText,
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.warn("[Sentinel Audit] Evaluate failed:", res.status, text);
          return;
        }

        const data = await res.json();
        const parsed = ScorecardResponseSchema.parse(data);

        setLastAudit(parsed);
        onAudit?.({ verdict: parsed.verdict, score: parsed.score });

        console.log(
          `[Sentinel Audit] Score: ${parsed.score} | Verdict: ${parsed.verdict}`,
        );
      } catch (e) {
        console.warn("[Sentinel Audit] Judge failure:", e);
        onAudit?.(null);
      } finally {
        setIsAuditing(false);
      }
    },
  });

  const showWelcome = !hasStarted && !completion && !isLoading;

  useEffect(() => {
    if (!error) return;

    toast({
      title: "Chat error",
      description:
        error.message ||
        "Sentinel Docs ran into an issue generating a response. Please try again.",
    });
  }, [error, toast]);

  async function fetchSources(prompt: string) {
    if (!sessionId) {
      toast({
        title: "Preparing workspace",
        description: "Please wait a moment and try again.",
      });
      return;
    }

    try {
      const response = await fetch("/api/chat/sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: prompt,
          sessionId,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          data?.error || "Failed to retrieve source snippets for this answer.",
        );
      }

      const data = (await response.json()) as { sources?: RetrievedChunk[] };
      const nextSources = data.sources ?? [];
      setSources(nextSources);
      sourcesRef.current = nextSources;
    } catch (err) {
      toast({
        title: "Source retrieval failed",
        description:
          (err as Error).message ||
          "We couldn’t load the source snippets. The answer may still be correct, but less verifiable.",
      });
    }
  }

  return (
    <Card className="flex h-full min-h-[420px] flex-col border-white/15 bg-slate-950/40 p-3 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="inline-flex size-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/50">
            <Sparkles className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Sentinel Docs</span>
            <span className="text-[10px] text-slate-400">
              Start a secure session: Ask a question to audit your sanitized
              document context.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex-1 max-h-[420px] rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2">
        <div className="flex h-full flex-col gap-2 overflow-y-auto pb-1 pt-0">
          {showWelcome && (
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-300 ring-1 ring-white/10">
              <p className="font-medium text-slate-100">
                You&apos;re connected to the Sentinel Docs Secure RAG shell.
              </p>
              <p>
                Upload a sensitive PDF to begin a{" "}
                <strong>grounded, sanitized</strong> analysis session.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
                <li>
                  “Identify any <strong>PII leaks</strong> or high-risk
                  identifiers in this contract.”
                </li>
                <li>
                  “Summarize the financial obligations on{" "}
                  <strong>[Page 1]</strong> while masking personal data.”
                </li>
                <li>
                  “Analyze the Q4 performance—verify my answer against the{" "}
                  <strong>Source Breadcrumbs</strong>”.
                </li>
              </ul>
            </div>
          )}

          {completion && (
            <div className="flex flex-col gap-2 justify-start">
              <div className="flex justify-start">
                <div className="inline-flex max-w-[85%] items-start gap-2 rounded-2xl bg-slate-900/80 px-3 py-2 text-xs text-slate-50 shadow-sm ring-1 ring-white/10">
                  <div className="mt-[1px]">
                    <div className="inline-flex size-5 items-center justify-center rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/40">
                      <Sparkles className="size-3" />
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-[11px] leading-relaxed md:text-xs">
                    {completion}
                  </p>
                </div>
              </div>

              {isAuditing && (
                <div className="text-[10px] text-slate-400">
                  Sentinel Audit Status: evaluating grounding…
                </div>
              )}

              {!isAuditing && lastAudit && (
                <div className="text-[10px] text-slate-400 font-bold">
                  Sentinel Audit Status:{" "}
                  <span
                    className={
                      lastAudit.verdict === "PASSED"
                        ? "text-emerald-400"
                        : lastAudit.verdict === "FAILED"
                          ? "text-red-400/80"
                          : "text-amber-400/80"
                    }
                  >
                    {lastAudit.verdict}
                  </span>{" "}
                  (score: {lastAudit.score.toFixed(2)})
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={async (event) => {
          // Prevent default immediately to avoid synthetic event pooling issues
          event.preventDefault();

          const value = input.trim();
          if (!value) return;

          // Check for ingestion
          const isIngested =
            typeof window !== "undefined" &&
            window.localStorage.getItem("sentinel-docs-ingested");

          if (!isIngested) {
            toast({
              title: "Upload a sensitive PDF first",
              description:
                "Ingest at least one PDF on the left before asking questions.",
            });
            return;
          }

          setHasStarted(true);

          // Ensure the judge sees the same retrieved context used for grounding.
          await fetchSources(value);

          // Trigger the AI stream (do NOT pass the pooled event)
          handleSubmit();
        }}
        className="mt-3 flex items-center gap-2 rounded-2xl border border-white/15 bg-slate-950/70 p-2 text-xs shadow-inner shadow-slate-950/60"
      >
        <Input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question about your PDFs…"
          className="h-9 border-none bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          size="icon-sm"
          className="shrink-0 rounded-xl bg-emerald-500/90 text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400"
          disabled={isLoading || !input.trim()}
        >
          <ArrowUpRight className="size-3.5" />
        </Button>
      </form>

      {completion && sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 px-1 text-[10px]">
          {sources.map((source, index) => (
            <button
              key={source.id ?? index}
              type="button"
              className="rounded-full border border-white/15 bg-slate-900/80 px-2.5 py-1 text-slate-200 shadow-sm backdrop-blur transition-all hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-100"
              onClick={() => {
                if (
                  typeof navigator !== "undefined" &&
                  navigator.clipboard?.writeText
                ) {
                  void navigator.clipboard.writeText(source.text);
                  toast({
                    title: source.page
                      ? `Page ${source.page} Snippet Copied`
                      : `Source ${index + 1} Copied`,
                    description:
                      "The full source snippet is now in your clipboard.",
                  });
                }
              }}
            >
              <span className="font-medium">
                {source.page ? `[Page ${source.page}]` : `Source ${index + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
