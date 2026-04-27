import { describe, expect, it } from 'vitest';
import { buildStructure } from '../structure-service';

describe('buildStructure', () => {
  it('returns default pages for business deck flow', () => {
    const pages = buildStructure('更适合招商/销售介绍');
    expect(pages[0].role).toBe('cover');
    expect(pages.some((page) => page.role === 'comparison')).toBe(true);
    expect(pages.some((page) => page.role === 'closing')).toBe(true);
  });
});
