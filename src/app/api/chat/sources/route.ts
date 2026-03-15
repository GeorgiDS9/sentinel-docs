import { NextResponse } from "next/server"

import { retrieveRelevantChunks } from "@/lib/ai/rag-engine"

export async function POST(request: Request) {
  const body = (await request.json()) as {
    query?: string
    sessionId?: string
  }

  const query = body.query?.trim()
  const sessionId = body.sessionId ?? "default-session"

  if (!query) {
    return NextResponse.json(
      { error: "A query is required to retrieve sources." },
      { status: 400 },
    )
  }

  const chunks = await retrieveRelevantChunks(sessionId, query, 3)

  return NextResponse.json({ sources: chunks }, { status: 200 })
}

