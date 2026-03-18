import { NextResponse } from "next/server"
import { ingestPdfForSession } from "@/lib/ai/rag-engine"
import { IngestSchema } from "@/lib/validation" // 🛡️ Import the master key

export async function POST(request: Request) {
  const formData = await request.formData()

  // Validate the incoming FormData against our Schema
  const submission = IngestSchema.safeParse({
    file: formData.get("file"),
    sessionId: formData.get("sessionId"),
  })

  // 🛡️ Fail Fast: If validation fails, return the specific error to the UI
  if (!submission.success) {
    // We grab the first issue's message (e.g., "Only PDFs are authorized")
    const errorMsg = submission.error.issues[0]?.message || "Invalid upload data"
    
    return NextResponse.json(
      { error: errorMsg },
      { status: 400 }
    )
  }

  // Destructure the validated, type-safe data
  const { file, sessionId } = submission.data

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Capture the result (which now includes success and securityAudit stats)
    const result = await ingestPdfForSession(buffer, sessionId)

    // Return the status AND the security report to the UI
    return NextResponse.json(
      { 
        status: "ok", 
        sessionId, 
        message: "Document ready for chat.",
        securityAudit: result.securityAudit 
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