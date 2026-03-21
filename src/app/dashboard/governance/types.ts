export type AuditStats = {
  emails: number;
  phones: number;
  cards: number;
  ssns: number;
};

export type HealthStatus = "BASELINING" | "COMPLIANT" | "REVIEW" | "VIOLATION";

export type SessionUsage = {
  promptTokens: number;
  completionTokens: number;
};

export type ComplianceRow = {
  function: string;
  requirement: string;
  evidence: string;
  detail: string;
};

export type ModelBenchmarkRow = {
  model: string;
  faithfulness: number | null; // 0..1
  latencyMs: number | null;
  costUsd: number | null; // per response
  status: "active" | "pending";
};
