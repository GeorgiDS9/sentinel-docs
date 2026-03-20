import { NextResponse } from "next/server";
import { z } from "zod";
import * as ai from "ai";
import { Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { wrapAISDK } from "langsmith/experimental/vercel";

// Enable LangSmith tracing for this route (does not affect your chat streaming).
const { generateText } = wrapAISDK(ai);

const RequestSchema = z.object({
  sessionId: z.string().min(1).optional(),
  context: z.array(z.string()).min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

const VerdictSchema = z.enum(["PASSED", "FAILED", "NEEDS_REVIEW"]);

const ScorecardSchema = z.object({
  score: z.number().min(0).max(1),
  reasoning: z.string(),
  verdict: VerdictSchema,
});

export async function POST(req: Request) {
  try {
    const body = RequestSchema.parse(await req.json());

    const contextText = body.context.join("\n\n---\n\n");

    const system = `You are the Sentinel Docs Quality Auditor.
Evaluate the AI_ANSWER using ONLY the provided CONTEXT.

Rules:
- If a claim in AI_ANSWER is not supported by CONTEXT, mark FAILED.
- If the answer is mostly correct but contains minor assumptions or missing nuance not explicit in CONTEXT, mark NEEDS_REVIEW.
- If every claim is explicitly supported by CONTEXT, mark PASSED.

Return only the JSON object that matches the provided schema.`;

    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0,
      system,
      prompt: `SESSION_ID: ${body.sessionId ?? "unknown"}

CONTEXT:
${contextText}

QUESTION:
${body.question}

AI_ANSWER:
${body.answer}`,
      output: Output.object({ schema: ScorecardSchema }),
    });

    return NextResponse.json(result.output, { status: 200 });
  } catch (error) {
    console.error("Judge Failure:", error);
    return NextResponse.json(
      { error: "Governance Auditor Unavailable" },
      { status: 500 },
    );
  }
}
