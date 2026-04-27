import type { SourceAsset } from '@/domain/projects/types';

export type UnderstandingResult = {
  summary: string;
  keyPoints: string[];
  duplicates: string[];
  openQuestions: string[];
  visualizable: string[];
};

export function buildUnderstanding(input: { brief: string; sources: SourceAsset[] }): UnderstandingResult {
  return {
    summary: `已根据“${input.brief}”整理上传资料，建议先形成清晰的业务资料结构。`,
    keyPoints: input.sources.map((source) => `${source.name} 可作为 ${source.kind} 类输入继续拆解`),
    duplicates: [],
    openQuestions: ['是否需要优先面向领导汇报还是对外招商？'],
    visualizable: ['适合转成对比页的优势信息', '适合转成流程页的实施步骤']
  };
}
