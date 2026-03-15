/**
 * 🛡️ Sentinel Redaction Engine
 * Hardened regex patterns for PII detection and masking.
 */

const PII_PATTERNS = {
    // Catch standard email formats
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    
    // Catch common phone formats: +1 (555) 000-0000, 555.000.0000, etc.
    phone: /\b(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g,
    
    // Catch 16-digit credit card numbers
    creditCard: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[0-9]{13})\b/g,
    
    // Catch US Social Security Numbers
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
   * This runs in microseconds on the server, ensuring zero-latency security.
   */
  export function redactText(text: string): { 
    sanitizedText: string; 
    stats: RedactionStats 
  } {
    let sanitizedText = text;
    const stats: RedactionStats = { emails: 0, phones: 0, cards: 0, ssns: 0 };
  
    // Redact Emails
    const emailMatches = text.match(PII_PATTERNS.email) || [];
    stats.emails = emailMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.email, "[REDACTED_EMAIL]");
  
    // Redact Phones
    const phoneMatches = text.match(PII_PATTERNS.phone) || [];
    stats.phones = phoneMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.phone, "[REDACTED_PHONE]");
  
    // Redact Credit Cards
    const cardMatches = text.match(PII_PATTERNS.creditCard) || [];
    stats.cards = cardMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.creditCard, "[REDACTED_CARD]");
  
    // Redact SSNs
    const ssnMatches = text.match(PII_PATTERNS.ssn) || [];
    stats.ssns = ssnMatches.length;
    sanitizedText = sanitizedText.replace(PII_PATTERNS.ssn, "[REDACTED_SSN]");
  
    return { sanitizedText, stats };
  }