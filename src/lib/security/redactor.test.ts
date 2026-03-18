import { describe, it, expect } from 'vitest';
import { redactText } from './redactor';

describe('🛡️ Sentinel Redactor Engine', () => {
  
  it('should mask a standard credit card with spaces', () => {
    const input = "My Visa is 4111 2222 3333 4444";
    const { sanitizedText, stats } = redactText(input);
    
    expect(sanitizedText).toContain("[REDACTED_CARD]");
    expect(sanitizedText).not.toContain("4111");
    expect(stats.cards).toBe(1);
  });

  it('should mask multiple phone formats in one string', () => {
    const input = "Call (555) 010 9988 or 555-010-9988 or +1 555 010 9988";
    const { sanitizedText, stats } = redactText(input);
    
    // We expect 3 phones to be caught based on your high-precision regex
    expect(stats.phones).toBe(3);
    expect(sanitizedText.match(/\[REDACTED_PHONE\]/g)?.length).toBe(3);
  });

  it('should handle clean text without false positives', () => {
    const input = "The moon is Neon Pink and the year is 2026.";
    const { sanitizedText, stats } = redactText(input);
    
    expect(sanitizedText).toBe(input);
    expect(stats.emails).toBe(0);
    expect(stats.phones).toBe(0);
  });

  it('should mask a standard email address', () => {
    const input = "Contact us at security@sentinel.ai for details.";
    const { sanitizedText, stats } = redactText(input);
    
    expect(sanitizedText).toContain("[REDACTED_EMAIL]");
    expect(stats.emails).toBe(1);
  });
});