/**
 * 🛡️ Sentinel Redaction Engine
 * Standardized high-precision patterns for PII detection and masking.
 * These patterns align with the "Input Security Contract" in the README.
 */

const PII_PATTERNS = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    
    // 📞 Hardened Phone: Catches (555) 010 9988, 555-010-9988, etc.
    phone: /(?:\+?\d{1,3}[\s-.]*)?\(?\d{3}\)?[\s-.]*\d{3}[\s-.]*\d{4}/g,
    
    // 💳 Space-Proof Credit Card: Catches 13-16 digits with spaces or dashes
    // This solves the 4111 2222... leak from your screenshot.
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  };
  
  export type RedactionStats = {
    emails: number;
    phones: number;
    cards: number;
    ssns: number;
  };
  
  /**
   * Sanitizes input text by replacing PII with secure placeholders.
   */
  export function redactText(text: string): { 
    sanitizedText: string; 
    stats: RedactionStats 
  } {
    let sanitizedText = text;
    const stats: RedactionStats = { emails: 0, phones: 0, cards: 0, ssns: 0 };
  
    // 🛡️ STEP 1: INTERCEPT EMAILS
    const emailMatches = sanitizedText.match(PII_PATTERNS.email) || [];
    stats.emails = emailMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.email, "[REDACTED_EMAIL]");
  
    // 🛡️ STEP 2: INTERCEPT PHONES
    const phoneMatches = sanitizedText.match(PII_PATTERNS.phone) || [];
    stats.phones = phoneMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.phone, "[REDACTED_PHONE]");
  
    // 🛡️ STEP 3: INTERCEPT CREDIT CARDS (The "Visa Leak" Fix)
    const cardMatches = sanitizedText.match(PII_PATTERNS.creditCard) || [];
    stats.cards = cardMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.creditCard, "[REDACTED_CARD]");
  
    // 🛡️ STEP 4: INTERCEPT SSNs
    const ssnMatches = sanitizedText.match(PII_PATTERNS.ssn) || [];
    stats.ssns = ssnMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.ssn, "[REDACTED_SSN]");
  
    return { sanitizedText, stats };
  }