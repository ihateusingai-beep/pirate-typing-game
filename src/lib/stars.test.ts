import { describe, it, expect } from 'vitest';
import { calculateStars } from './stars';

describe('calculateStars', () => {
  it('returns 3 stars for 0 mistakes', () => {
    expect(calculateStars(0, 10)).toBe(3);
  });

  it('returns 3 stars for mistakes at exactly 0.5× total (perfect + half)', () => {
    expect(calculateStars(5, 10)).toBe(3); // 0.5 rate
  });

  it('returns 2 stars for mistakes between 0.5× and 1× total', () => {
    expect(calculateStars(6, 10)).toBe(2);  // 0.6 rate
    expect(calculateStars(10, 10)).toBe(2); // 1.0 rate exactly
  });

  it('returns 1 star for mistakes between 1× and 2× total', () => {
    expect(calculateStars(11, 10)).toBe(1); // 1.1 rate
    expect(calculateStars(20, 10)).toBe(1); // 2.0 rate exactly
  });

  it('returns 0 stars for mistakes > 2× total', () => {
    expect(calculateStars(21, 10)).toBe(0);
    expect(calculateStars(100, 10)).toBe(0);
  });

  it('returns 0 stars when total is 0 (defensive — divide by zero guard)', () => {
    expect(calculateStars(0, 0)).toBe(0);
    expect(calculateStars(5, 0)).toBe(0);
  });

  it('handles negative mistakes safely (defensive)', () => {
    // Negative mistakes is nonsensical but shouldn't crash
    expect(calculateStars(-1, 10)).toBe(3); // -0.1 rate, less than 0.5
  });
});
