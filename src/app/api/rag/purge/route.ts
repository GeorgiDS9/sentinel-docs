
import { NextResponse } from "next/server";
import { index as upstashIndex } from "@/lib/ai/rag-engine";
import { z } from "zod";

const PurgeSchema = z.object({
  sessionId: z.string().min(20),
});

export async function POST(req: Request) {
    try {
      const json = await req.json();
      const result = PurgeSchema.safeParse(json);
  
      if (!result.success) {
        return NextResponse.json({ error: "Invalid session" }, { status: 400 });
      }
  
      const { sessionId } = result.data;
  
      // 🛡️ THE CLOUD WIPE: Target the namespace first, then reset it
      const namespace = upstashIndex.namespace(sessionId);
      await namespace.reset(); 
  
      return NextResponse.json({ status: "purged" });
    } catch (error) {
      console.error("Purge error:", error);
      return NextResponse.json(
        { error: "Failed to decommission vault" }, 
        { status: 500 }
      );
    }
  }