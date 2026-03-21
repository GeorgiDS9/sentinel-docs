import { ExternalLink, FileDown } from "lucide-react";
import { Card } from "@/components/ui/card";

type AuditActionsCardProps = {
  sessionId: string;
  langsmithTraceUrl: string;
};

export function AuditActionsCard({
  sessionId,
  langsmithTraceUrl,
}: AuditActionsCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-3xl dark:bg-slate-900/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Audit Actions
          </h2>
          <p className="mt-1 text-xs text-slate-300/75">
            Open session trace evidence and export compliance report artifacts.
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Session:{" "}
            <span className="font-mono text-slate-300">
              {sessionId || "No active session"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {sessionId ? (
            <a
              href={langsmithTraceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-100 shadow-sm backdrop-blur transition-colors hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
            >
              <ExternalLink className="size-3.5" />
              <span>Open LangSmith Trace</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="No active session"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/40 px-3 py-1 text-xs font-medium text-slate-400 shadow-sm backdrop-blur cursor-not-allowed"
            >
              <ExternalLink className="size-3.5" />
              <span>Open LangSmith Trace</span>
            </button>
          )}

          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-200/60 shadow-sm backdrop-blur cursor-not-allowed"
          >
            <FileDown className="size-3.5" />
            <span>Compliance Export (Coming soon)</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
