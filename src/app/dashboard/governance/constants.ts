import type {
  AuditStats,
  ComplianceRow,
  ModelBenchmarkRow,
  SessionUsage,
} from "./types";

// LocalStorage keys shared with home/chat
export const AUDIT_STATS_KEY = "sentinel-audit-stats";
export const JUDGE_HISTORY_KEY = "sentinel-judge-history";
export const SESSION_ID_KEY = "sentinel-docs-session-id";

// Cost telemetry (UI scaffold for upcoming LangSmith wiring)
// SESSION_COST_KEY stores per-session token usage in localStorage.
// Pricing uses current GPT-4o-mini public rates (USD per 1M tokens).
export const SESSION_COST_KEY = "sentinel-session-cost-v1";
export const OPENAI_GPT4O_MINI_INPUT_PER_M = 0.15;
export const OPENAI_GPT4O_MINI_OUTPUT_PER_M = 0.6;
export const TARGET_COST_USD_PER_RESPONSE = 0.01;

export const EMPTY_STATS: AuditStats = {
  emails: 0,
  phones: 0,
  cards: 0,
  ssns: 0,
};
export const EMPTY_USAGE: SessionUsage = {
  promptTokens: 0,
  completionTokens: 0,
};

export const complianceRows: ComplianceRow[] = [
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

export const benchmarkRows: ModelBenchmarkRow[] = [
  {
    model: "GPT-4o-mini",
    faithfulness: 0.98,
    latencyMs: 800,
    costUsd: 0.002,
    status: "active",
  },
  {
    model: "Llama 3.3 70B",
    faithfulness: null,
    latencyMs: null,
    costUsd: null,
    status: "pending",
  },
];
