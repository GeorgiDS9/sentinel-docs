import { z } from "zod";

/**
 * 🛡️ Sentinel Validation Suite
 * Centralized schemas for API and Frontend integrity.
 */

// 1. Ingestion Validation (The "Bouncer")
export const IngestSchema = z.object({
  sessionId: z.string().min(20, "Invalid Session Identity"),
  file: z
    .custom<File>((val) => val instanceof File, "Missing File")
    .refine((file) => file.type === "application/pdf", "Only PDFs are authorized")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File exceeds 5MB security limit"),
});

// 2. Chat Validation (The "Interceptor")
export const ChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000, "Query exceeds safety length"),
    })
  ),
  sessionId: z.string().min(20),
});

export type IngestInput = z.infer<typeof IngestSchema>;
export type ChatInput = z.infer<typeof ChatSchema>;