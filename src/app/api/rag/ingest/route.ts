import { NextResponse } from "next/server"

import { ingestPdfForSession } from "@/lib/ai/rag-engine"

export async function POST(request: Request) {
  const formData = await request.formData()

  const file = formData.get("file")
  const sessionId =
    (formData.get("sessionId") as string | null) ?? "default-session"

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "A PDF file is required." },
      { status: 400 },
    )
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    await ingestPdfForSession(buffer, sessionId)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Failed to ingest PDF." },
      { status: 400 },
    )
  }

  return NextResponse.json(
    { status: "ok", sessionId, message: "Document ready for chat." },
    { status: 200 },
  )
}

