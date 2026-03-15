import { OpenAIEmbeddings } from "@langchain/openai"
import PDFParser from "pdf2json";

type SessionId = string;

export type RetrievedChunk = {
  id: number
  text: string
}

type SessionStore = {
  chunks: string[]
  vectors: number[][]
  rawText: string
}

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
})

// Ensure sessionStores persists across hot reloads in dev
const globalForRag = globalThis as unknown as {
  __SENTINEL_DOCS_SESSION_STORES__?: Map<SessionId, SessionStore>
}
export const sessionStores: Map<SessionId, SessionStore> =
  globalForRag.__SENTINEL_DOCS_SESSION_STORES__ || new Map<SessionId, SessionStore>()
if (!globalForRag.__SENTINEL_DOCS_SESSION_STORES__) {
  globalForRag.__SENTINEL_DOCS_SESSION_STORES__ = sessionStores
}

function chunkText(
  text: string,
  chunkSize = 1000,
  chunkOverlap = 200,
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim()
  const chunks: string[] = []

  if (!normalized) return chunks

  let start = 0
  while (start < normalized.length) {
    const end = start + chunkSize
    const slice = normalized.slice(start, end)
    chunks.push(slice)

    if (end >= normalized.length) break
    start = end - chunkOverlap
  }

  return chunks
}

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (!normA || !normB) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true); // Use text-only mode

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData?.parserError || errData as Error));
    pdfParser.on("pdfParser_dataReady", () => {
      // Use the built-in raw text extractor - it's much more reliable than walking the JSON tree
      const rawText = pdfParser.getRawTextContent();
      resolve(decodeURIComponent(rawText));
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function ingestPdfForSession(buffer: Buffer, sessionId: string) {
  try {
    const text = await extractTextFromPdf(buffer);
    
    if (!text || text.trim().length < 10) {
      throw new Error("Extraction resulted in empty text.");
    }

    const chunks = chunkText(text, 1000, 200);
    const vectors = await embeddings.embedDocuments(chunks);

    sessionStores.set(sessionId, {
      chunks,
      vectors,
      rawText: text,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Ingestion Error:", error);
    throw error;
  }
}

export async function retrieveRelevantChunks(
  sessionId: SessionId,
  query: string,
  k = 3,
): Promise<RetrievedChunk[]> {
  const store = sessionStores.get(sessionId)
  if (!store) {
    return []
  }

  const queryVector = await embeddings.embedQuery(query)

  const scored = store.chunks.map((chunk, index) => ({
    chunk,
    score: cosineSimilarity(queryVector, store.vectors[index]),
  }))

  scored.sort((a, b) => b.score - a.score)

  const top = scored
    .slice(0, k)
    .filter((item) => item.score > 0)
    .map((item, index) => ({
      id: index,
      text: item.chunk,
    }))

  return top
}

