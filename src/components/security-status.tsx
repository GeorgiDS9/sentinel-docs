"use client";

import { ShieldCheck, ShieldAlert, Activity, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SecurityStatusProps {
  stats: {
    emails: number;
    phones: number;
    cards: number;
    ssns: number;
  };
  isIngested: boolean;
}

export function SecurityStatus({ stats, isIngested }: SecurityStatusProps) {
  const totalBlocked = stats.emails + stats.phones + stats.cards + stats.ssns;

  return (
    <Card className="p-4 border-white/10 bg-slate-950/40 backdrop-blur-2xl ring-1 ring-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShieldCheck
              className={`size-5 ${isIngested ? "text-emerald-400" : "text-slate-500"}`}
            />
            {isIngested && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Sentinel Guard
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 border border-white/5">
          <Activity className="size-3 text-sky-400" />
          <span className="text-[9px] text-sky-300 font-mono">ACTIVE</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-tight">
          <span className="text-slate-400 font-medium">DLP Shield Status</span>
          <span
            className={
              isIngested ? "text-emerald-400 font-bold" : "text-slate-500"
            }
          >
            {isIngested ? "HARDENED" : "WAITING..."}
          </span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 rounded-lg p-2 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1 opacity-60">
              <ShieldAlert className="size-3 text-amber-400" />
              <span className="text-[8px] uppercase tracking-tighter text-slate-300">
                PII Blocked
              </span>
            </div>
            <div className="text-xs font-bold font-mono text-amber-400">
              {totalBlocked}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-2 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1 opacity-60">
              <Lock className="size-3 text-violet-400" />
              <span className="text-[8px] uppercase tracking-tighter text-slate-300">
                Session
              </span>
            </div>
            <div className="text-xs font-bold font-mono text-violet-400">
              ISOLATED
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
