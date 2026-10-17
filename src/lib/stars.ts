// ============================================================================
// Star rating calculator — extracted from Battle.tsx for unit testing.
// mistakes ≤ 0.5× total → 3 stars
// mistakes ≤ 1× total   → 2 stars
// mistakes ≤ 2× total   → 1 star
// mistakes > 2× total   → 0 stars (failed)
// ============================================================================

export function calculateStars(mistakes: number, total: number): 0 | 1 | 2 | 3 {
  if (total <= 0) return 0;
  const rate = mistakes / total;
  if (rate <= 0.5) return 3;
  if (rate <= 1) return 2;
  if (rate <= 2) return 1;
  return 0;
}
