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

  it('summarizes extracted text and table blocks', () => {
    const result = buildUnderstanding({
      brief: '做成招商汇报',
      sources: [
        {
          id: '1',
          name: '业务介绍.docx',
          kind: 'document',
          path: 'x',
          status: 'ready',
          blocks: [{ type: 'paragraph', text: '业务优势是渠道覆盖全国' }],
          extractStatus: 'success'
        }
      ]
    });

    expect(result.keyPoints[0]).toContain('业务优势');
  });
});
