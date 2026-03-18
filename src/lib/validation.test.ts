import { describe, it, expect } from 'vitest';
import { IngestSchema } from './validation';

describe('🛡️ Sentinel Validation Guard', () => {

  it('should reject a non-PDF file (Type Safety)', () => {
    const fakeFile = new File(["not a pdf"], "virus.exe", { type: "application/x-msdownload" });
    const result = IngestSchema.safeParse({ 
      file: fakeFile, 
      sessionId: "valid-session-id-long-enough-for-zod" 
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Only PDFs are authorized");
    }
  });

  it('should reject a file over 5MB (DoS Protection)', () => {
    // Create a 6MB dummy file
    const hugeFile = new File(["a".repeat(6 * 1024 * 1024)], "huge.pdf", { type: "application/pdf" });
    const result = IngestSchema.safeParse({ 
      file: hugeFile, 
      sessionId: "valid-session-id-long-enough-for-zod" 
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("File exceeds 5MB security limit");
    }
  });

  it('should accept a valid small PDF (Success Path)', () => {
    const validFile = new File(["%PDF-1.4"], "safe.pdf", { type: "application/pdf" });
    const result = IngestSchema.safeParse({ 
      file: validFile, 
      sessionId: "valid-session-id-long-enough-for-zod" 
    });
    
    expect(result.success).toBe(true);
  });
});