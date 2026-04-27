import { describe, expect, it } from 'vitest';
import { buildUnderstanding } from '../understanding-service';

describe('buildUnderstanding', () => {
  it('extracts summary, key points, and open questions', () => {
    const result = buildUnderstanding({
      brief: '做成招商汇报',
      sources: [{ id: '1', name: '介绍文档.docx', kind: 'document', path: 'x', status: 'ready' }]
    });

    expect(result.summary).toContain('招商汇报');
    expect(result.keyPoints.length).toBeGreaterThan(0);
    expect(Array.isArray(result.openQuestions)).toBe(true);
  });
});
