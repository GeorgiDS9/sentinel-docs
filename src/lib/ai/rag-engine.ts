import { OpenAIEmbeddings } from "@langchain/openai";
import PDFParser from "pdf2json";
import { redactText } from "@/lib/security/redactor";
import { Index } from "@upstash/vector";

// 🛡️ Initialize the Cloud Index
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export type RetrievedChunk = {
  id: string | number;
  text: string;
};

// --- PDF & Chunking Helpers (Keep these the same) ---

function chunkText(text: string, chunkSize = 1000, chunkOverlap = 200): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  if (!normalized) return chunks;

  let start = 0;
  while (start < normalized.length) {
    const end = start + chunkSize;
    chunks.push(normalized.slice(start, end));
    if (end >= normalized.length) break;
    start = end - chunkOverlap;
  }
  return chunks;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData?.parserError || errData));
    pdfParser.on("pdfParser_dataReady", () => {
      const rawText = pdfParser.getRawTextContent();
      try {
        resolve(decodeURIComponent(rawText));
      } catch (e) {
        resolve(rawText);
      }
    });
    pdfParser.parseBuffer(buffer);
  });
}

// --- 🛡️ The "Amnesia Cure" Logic ---

export async function ingestPdfForSession(buffer: Buffer, sessionId: string) {
  try {
    const rawText = await extractTextFromPdf(buffer);
    const { sanitizedText, stats } = redactText(rawText);

    const chunks = chunkText(sanitizedText, 1000, 200);
    const vectors = await embeddings.embedDocuments(chunks);

    // 🛡️ CLOUD UPSERT: Save to Upstash using sessionId as a namespace
    // This keeps different users' data isolated within the same index.
    const upstashNamespace = index.namespace(sessionId);
    
    const records = chunks.map((text, i) => ({
      id: `chunk-${i}-${Date.now()}`, // Unique ID for the record
      vector: vectors[i],
      metadata: { text }, // 🟢 We store the sanitized text in metadata for retrieval
    }));

    await upstashNamespace.upsert(records);

    return { success: true, securityAudit: stats };
  } catch (error) {
    console.error("❌ Ingestion Error:", error);
    throw error;
  }
}

export async function retrieveRelevantChunks(
  sessionId: string,
  query: string,
  k = 3
): Promise<RetrievedChunk[]> {
  try {
    const queryVector = await embeddings.embedQuery(query);

    // 🛡️ CLOUD QUERY: Search only within the specific user's namespace
    const upstashNamespace = index.namespace(sessionId);
    
    const results = await upstashNamespace.query({
      vector: queryVector,
      topK: k,
      includeMetadata: true, // 🟢 This pulls our sanitized text back out
    });

    return results.map((res) => ({
      id: res.id,
      text: res.metadata?.text as string || "Metadata missing",
    }));
  } catch (error) {
    console.error("❌ Retrieval Error:", error);
    return [];
  }
}