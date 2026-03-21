import { Card } from "@/components/ui/card";
import type { ComplianceRow } from "../types";

type ComplianceMatrixCardProps = {
  rows: ComplianceRow[];
};

export function ComplianceMatrixCard({ rows }: ComplianceMatrixCardProps) {
  return (
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
          <caption className="sr-only">
            NIST AI RMF compliance mapping of Sentinel controls, evidence, and audit details.
          </caption>
          <thead className="bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-300/80">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                NIST Function
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Requirement
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Evidence
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Audit Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.function}
                className="border-t border-white/10 bg-slate-900/30 text-slate-100/90"
              >
                <td className="px-4 py-3 font-semibold text-emerald-300">
                  {row.function}
                </td>
                <td className="px-4 py-3 text-slate-200/90">{row.requirement}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-200">
                    {row.evidence}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300/85">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}