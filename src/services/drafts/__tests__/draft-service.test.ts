import { describe, expect, it } from 'vitest';
import { buildDraftVariants } from '../draft-service';

describe('buildDraftVariants', () => {
  it('returns stable and expressive variants', () => {
    const variants = buildDraftVariants(['封面', '方案对比']);
    expect(variants.map((item) => item.id)).toEqual(['stable', 'expressive']);
  });
});
