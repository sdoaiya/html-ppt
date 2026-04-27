import type { ExtractedSourceAsset, SourceAsset } from '@/domain/projects/types';

export type UnderstandingResult = {
  summary: string;
  keyPoints: string[];
  duplicates: string[];
  openQuestions: string[];
  visualizable: string[];
  structureHints?: string[];
};

function extractKeyPointsFromBlocks(source: ExtractedSourceAsset) {
  return (source.blocks ?? [])
    .filter((block) => block.type === 'paragraph')
    .map((block) => block.text)
    .slice(0, 2);
}

function extractVisualizableFromBlocks(source: ExtractedSourceAsset) {
  return (source.blocks ?? [])
    .filter((block) => block.type === 'table_summary')
    .map((block) => block.text);
}

export function buildUnderstanding(input: { brief: string; sources: SourceAsset[] }): UnderstandingResult {
  const extractedSources = input.sources as ExtractedSourceAsset[];
  const blockKeyPoints = extractedSources.flatMap(extractKeyPointsFromBlocks);
  const tableHints = extractedSources.flatMap(extractVisualizableFromBlocks);

  return {
    summary: `已根据“${input.brief}”整理上传资料，建议先形成清晰的业务资料结构。`,
    keyPoints: blockKeyPoints.length ? blockKeyPoints : input.sources.map((source) => `${source.name} 可作为 ${source.kind} 类输入继续拆解`),
    duplicates: [],
    openQuestions: ['是否需要优先面向领导汇报还是对外招商？'],
    visualizable: tableHints.length ? tableHints : ['适合转成对比页的优势信息', '适合转成流程页的实施步骤'],
    structureHints: ['建议先给出结论，再展示优势对比与实施路径']
  };
}
