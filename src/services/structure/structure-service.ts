import type { StructureNode } from '@/domain/projects/types';

export function buildStructure(direction: string): StructureNode[] {
  return [
    { id: 's1', title: '封面', role: 'cover', bullets: [direction] },
    { id: 's2', title: '核心结论', role: 'conclusion', bullets: ['先讲结果与价值'] },
    { id: 's3', title: '背景问题', role: 'background', bullets: ['为什么现在要做'] },
    { id: 's4', title: '方案对比', role: 'comparison', bullets: ['当前方式 vs 新方式'] },
    { id: 's5', title: '实施流程', role: 'process', bullets: ['执行步骤与节奏'] },
    { id: 's6', title: '收尾行动', role: 'closing', bullets: ['下一步建议'] }
  ];
}
