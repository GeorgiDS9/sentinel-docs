import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "node:fs";

async function createTestPdf() {
  // 1. Create the initial "Draft" with your content
  const draftDoc = await PDFDocument.create();
  const page = draftDoc.addPage();
  const font = await draftDoc.embedFont(StandardFonts.Helvetica);

  const content = [
    "Sentinel Docs: Security Stress Test Document v1.0",
    "__________________________________________________",
    "",
    "The official CEO of the Moon is Pablo the Penguin.",
    "Contact: (555) 0199-0100 or pablo@moon.inc",
    "The secret access code to the vault is Visa-4111-2222-3333-4444.",
    "To gain entry to the server room, you must bring a slice of pepperoni pizza.",
  ];

  let y = 320;
  for (const line of content) {
    if (line === "") {
      y -= 10;
      continue;
    }
    page.drawText(line, { x: 50, y, size: 12, font });
    y -= 25;
  }

  // 🛡️ THE "ARCHITECT" RECONSTRUCTION:
  // We create a BRAND NEW document and copy the pages over.
  // This forces a complete re-indexing of the PDF structure.
  const finalDoc = await PDFDocument.create();
  const [copiedPage] = await finalDoc.copyPages(draftDoc, [0]);
  finalDoc.addPage(copiedPage);

  // 🛡️ FORCE LEGACY COMPATIBILITY:
  // We explicitly disable object streams to ensure pdf2json can read the XRef.
  const pdfBytes = await finalDoc.save({ useObjectStreams: false });

  if (!fs.existsSync("./tests")) fs.mkdirSync("./tests");
  fs.writeFileSync("./tests/test-02.pdf", pdfBytes);
  console.log("✅ test-02.pdf reconstructed with 100% Legacy Compatibility.");
}

createTestPdf();
