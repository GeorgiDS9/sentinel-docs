import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

type RedactionCounterCardProps = {
  totalBlocked: number;
};

export function RedactionCounterCard({
  totalBlocked,
}: RedactionCounterCardProps) {
  return (
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
  );
}
