import { describe, expect, it } from 'vitest';
import { autoBuildPagePrompt } from '../prompt-builder';

describe('autoBuildPagePrompt', () => {
  it('generates cover prompt from brief and role', () => {
    const result = autoBuildPagePrompt('招商汇报', '封面', 'cover');
    expect(result).toContain('招商汇报');
    expect(result).toContain('封面');
    expect(result).toContain('16:9');
    expect(result).toContain('大气稳重');
  });

  it('generates data page prompt from brief and role', () => {
    const result = autoBuildPagePrompt('产品介绍', '核心数据', 'data');
    expect(result).toContain('核心数据');
    expect(result).toContain('信息图表');
  });

  it('falls back to generic tone for unknown role', () => {
    const result = autoBuildPagePrompt('活动方案', '互动问答', 'unknown_role');
    expect(result).toContain('现代商务');
  });
});
