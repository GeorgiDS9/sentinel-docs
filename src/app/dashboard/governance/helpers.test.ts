import { describe, expect, it } from "vitest";
import {
  formatCostPerResponse,
  formatLatency,
  formatUsd,
  getHealthHint,
  getHealthPillClass,
  getHealthStatus,
  getHeatColor,
} from "./helpers";

describe("governance/helpers", () => {
  describe("getHeatColor", () => {
    it("returns emerald class for >= 0.9", () => {
      expect(getHeatColor(0.9)).toBe("bg-emerald-400/80 ring-emerald-300/60");
      expect(getHeatColor(1)).toBe("bg-emerald-400/80 ring-emerald-300/60");
    });

    it("returns amber class for >= 0.7 and < 0.9", () => {
      expect(getHeatColor(0.7)).toBe("bg-amber-400/80 ring-amber-300/60");
      expect(getHeatColor(0.89)).toBe("bg-amber-400/80 ring-amber-300/60");
    });

    it("returns rose class for < 0.7", () => {
      expect(getHeatColor(0.69)).toBe("bg-rose-400/80 ring-rose-300/60");
      expect(getHeatColor(0)).toBe("bg-rose-400/80 ring-rose-300/60");
    });
  });

  describe("getHealthStatus", () => {
    it("returns BASELINING for empty history", () => {
      expect(getHealthStatus([])).toBe("BASELINING");
    });

    it("returns VIOLATION if any score is below 0.7", () => {
      expect(getHealthStatus([0.95, 0.65, 0.91])).toBe("VIOLATION");
    });

    it("returns REVIEW if no violation but at least one score below 0.9", () => {
      expect(getHealthStatus([0.95, 0.82, 0.91])).toBe("REVIEW");
    });

    it("returns COMPLIANT if all scores are >= 0.9", () => {
      expect(getHealthStatus([0.9, 0.95, 1])).toBe("COMPLIANT");
    });
  });

  describe("getHealthPillClass", () => {
    it("maps each status to the expected style classes", () => {
      expect(getHealthPillClass("COMPLIANT")).toBe(
        "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
      );
      expect(getHealthPillClass("VIOLATION")).toBe(
        "border-rose-400/30 bg-rose-500/10 text-rose-200",
      );
      expect(getHealthPillClass("BASELINING")).toBe(
        "border-slate-400/30 bg-slate-500/10 text-slate-200",
      );
      expect(getHealthPillClass("REVIEW")).toBe(
        "border-amber-400/30 bg-amber-500/10 text-amber-200",
      );
    });
  });

  describe("getHealthHint", () => {
    it("returns baseline hint for zero samples regardless of status", () => {
      expect(getHealthHint("COMPLIANT", 0)).toBe(
        "No audit evidence yet: run Q&A in Secure RAG Shell to generate baseline scores.",
      );
    });

    it("returns compliant hint", () => {
      expect(getHealthHint("COMPLIANT", 3)).toBe(
        "All recent judge scores are in the compliant range.",
      );
    });

    it("returns violation hint", () => {
      expect(getHealthHint("VIOLATION", 3)).toBe(
        "At least one recent interaction entered violation range and needs review.",
      );
    });

    it("returns review hint fallback", () => {
      expect(getHealthHint("REVIEW", 3)).toBe(
        "Recent interactions indicate mixed reliability and require monitoring.",
      );
    });
  });

  describe("formatting helpers", () => {
    it("formats USD with 4 decimals", () => {
      expect(formatUsd(0.0039)).toBe("$0.0039");
      expect(formatUsd(1)).toBe("$1.0000");
    });

    it("formats latency in seconds", () => {
      expect(formatLatency(null)).toBe("--");
      expect(formatLatency(800)).toBe("0.80s");
      expect(formatLatency(1250)).toBe("1.25s");
    });

    it("formats cost per response", () => {
      expect(formatCostPerResponse(null)).toBe("--");
      expect(formatCostPerResponse(0.002)).toBe("$0.0020");
      expect(formatCostPerResponse(1)).toBe("$1.0000");
    });
  });
});
