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
    // Capture the result (which now includes success and securityAudit stats)
    const result = await ingestPdfForSession(buffer, sessionId)

    // Return the status AND the security report to the UI
    return NextResponse.json(
      { 
        status: "ok", 
        sessionId, 
        message: "Document ready for chat.",
        securityAudit: result.securityAudit // This is the magic line
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Failed to ingest PDF." },
      { status: 400 },
    )
  }
}

