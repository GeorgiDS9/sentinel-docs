import { OpenAIEmbeddings } from "@langchain/openai";
import PDFParser from "pdf2json";
import { redactText } from "@/lib/security/redactor";
import { Index } from "@upstash/vector";

// 🛡️ Initialize the Cloud Index
export const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export type RetrievedChunk = {
  id: string | number;
  text: string;
  page?: number;
};

/**
 * Splits text into semantic chunks with overlap to preserve context.
 */
function chunkText(
  text: string,
  chunkSize = 1000,
  chunkOverlap = 200,
): string[] {
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

/**
 * Canonicalize contract formats that pdf2json may split/reconstruct with spaces.
 * IMPORTANT: this rewrites INTO your strict README contract format so your
 * strict redaction regexes still work (no “tolerance” in the DLP regex itself).
 */
function canonicalizeContractFormats(text: string): string {
  // SSN contract: XXX-XX-XXXX
  // Normalize spaced hyphen variants introduced by extraction into strict form.
  return text.replace(/\b(\d{3})\s*-\s*(\d{2})\s*-\s*(\d{4})\b/g, "$1-$2-$3");
}

/**
 * Extracts text page-by-page to enable precise source breadcrumbs.
 */
async function extractPagesFromPdf(
  buffer: Buffer,
): Promise<{ text: string; page: number }[]> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData?.parserError || errData),
    );

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      // 🛡️ Iterate through the Pages array to capture text and page index
      const pages = pdfData.Pages.map((page: any, index: number) => {
        // Decode and join text elements for this specific page
        const pageText = page.Texts.map((t: any) =>
          decodeURIComponent(t.R[0].T),
        ).join(" ");
        return {
          text: pageText,
          page: index + 1, // PDFs are 1-indexed for human readability
        };
      });

      resolve(pages);
    });

    pdfParser.parseBuffer(buffer);
  });
}

/**
 * Sanitizes, chunks, and uploads PDF content to the cloud with page metadata.
 * Performance: Batches all embeddings into a single OpenAI call.
 */
export async function ingestPdfForSession(buffer: Buffer, sessionId: string) {
  try {
    const pages = await extractPagesFromPdf(buffer);
    const totalStats = { emails: 0, phones: 0, cards: 0, ssns: 0 };

    // 🛡️ 1. Prepare all text chunks and track their page origins
    const chunkData: { text: string; page: number }[] = [];

    for (const pageData of pages) {
      // Normalize contract formats into the strict standardized SSN xxx-xx-xxx form
      const canonicalText = canonicalizeContractFormats(pageData.text);

      const { sanitizedText, stats } = redactText(canonicalText);

      // Accumulate cumulative security stats for the dashboard
      totalStats.emails += stats.emails;
      totalStats.phones += stats.phones;
      totalStats.cards += stats.cards;
      totalStats.ssns += stats.ssns;

      const chunks = chunkText(sanitizedText, 1000, 200);
      chunks.forEach((chunk) => {
        chunkData.push({ text: chunk, page: pageData.page });
      });
    }

    if (chunkData.length === 0)
      return { success: true, securityAudit: totalStats };

    // 🛡️ 2. Batch Embed all chunks in ONE OpenAI call (Architecture Optimization)
    const allTexts = chunkData.map((item) => item.text);
    const vectors = await embeddings.embedDocuments(allTexts);

    // 🛡️ 3. Prepare records for Upstash Vector Cloud
    const records = chunkData.map((item, i) => ({
      id: `page-${item.page}-chunk-${i}-${Date.now()}`,
      vector: vectors[i],
      metadata: {
        text: item.text,
        page: item.page, // 🟢 The Breadcrumb
      },
    }));

    const upstashNamespace = index.namespace(sessionId);
    await upstashNamespace.upsert(records);

    return { success: true, securityAudit: totalStats };
  } catch (error) {
    console.error("❌ Ingestion Error:", error);
    throw error;
  }
}

/**
 * Searches the cloud vault for relevant chunks within a specific session namespace.
 */
export async function retrieveRelevantChunks(
  sessionId: string,
  query: string,
  k = 3,
): Promise<RetrievedChunk[]> {
  try {
    const queryVector = await embeddings.embedQuery(query);
    const upstashNamespace = index.namespace(sessionId);

    const results = await upstashNamespace.query({
      vector: queryVector,
      topK: k,
      includeMetadata: true,
    });

    return results.map((res) => ({
      id: res.id,
      text: (res.metadata?.text as string) || "Metadata missing",
      page: res.metadata?.page as number, // Pull the Breadcrumb
    }));
  } catch (error) {
    console.error("❌ Retrieval Error:", error);
    return [];
  }
}
