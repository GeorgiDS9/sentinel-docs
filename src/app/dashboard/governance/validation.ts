import { z } from "zod";

export const AuditStatsSchema = z.object({
  emails: z.number().int().nonnegative(),
  phones: z.number().int().nonnegative(),
  cards: z.number().int().nonnegative(),
  ssns: z.number().int().nonnegative(),
});

export const JudgeHistorySchema = z.array(z.number().min(0).max(1));
