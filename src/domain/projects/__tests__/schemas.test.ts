import { describe, expect, it } from 'vitest';
import { projectSchema } from '../schemas';

describe('projectSchema', () => {
  it('accepts a minimal project', () => {
    const result = projectSchema.safeParse({
      id: 'p1',
      name: '招商资料',
      stage: 'import',
      brief: '整理成招商汇报',
      sources: [],
      understanding: null,
      structure: [],
      variants: []
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid stage values', () => {
    const result = projectSchema.safeParse({ id: 'p1', name: 'x', stage: 'done' });
    expect(result.success).toBe(false);
  });
});
