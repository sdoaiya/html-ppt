import { describe, expect, it } from 'vitest';
import { runQualityChecks } from '../quality-service';

describe('runQualityChecks', () => {
  it('flags pages with missing visuals and open questions', () => {
    const result = runQualityChecks({
      openQuestions: ['封面品牌名待确认'],
      pages: [{ title: '封面', hasVisual: false, density: 'high' }]
    });

    expect(result.issues).toContain('存在待确认内容');
    expect(result.issues).toContain('存在缺少视觉素材的页面');
  });
});
