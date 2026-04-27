import type { ExtractedSourceAsset, SourceAsset } from '@/domain/projects/types';
import { extractTableBlocks } from './table-extractors';
import { extractTextBlocks } from './text-extractors';

export function classifyImportedFile(name: string): SourceAsset['kind'] {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext ?? '')) return 'image';
  if (['xlsx', 'csv'].includes(ext ?? '')) return 'spreadsheet';
  if (['mp3', 'wav', 'm4a'].includes(ext ?? '')) return 'audio';
  if (['zip', 'rar', '7z'].includes(ext ?? '')) return 'archive';
  return 'document';
}

export function createSourceAssetFromPath(filePath: string): SourceAsset {
  const name = filePath.split(/[\\/]/).pop() ?? filePath;
  return {
    id: crypto.randomUUID(),
    name,
    kind: classifyImportedFile(name),
    path: filePath,
    status: 'ready'
  };
}

export async function createExtractedSourceAsset(input: {
  path: string;
  name: string;
  kind: ExtractedSourceAsset['kind'];
  rawContent?: string;
  rows?: string[][];
}): Promise<ExtractedSourceAsset> {
  const base: ExtractedSourceAsset = {
    id: crypto.randomUUID(),
    name: input.name,
    kind: input.kind,
    path: input.path,
    status: 'ready',
    extractStatus: 'pending'
  };

  try {
    if (input.kind === 'spreadsheet' && input.rows) {
      const blocks = await extractTableBlocks({ kind: 'spreadsheet', name: input.name, rows: input.rows });
      return {
        ...base,
        extractStatus: 'success',
        blocks,
        extractSummary: blocks.find((item) => item.type === 'table_summary')?.text
      };
    }

    if (input.rawContent) {
      const blocks = await extractTextBlocks({ kind: 'document', name: input.name, content: input.rawContent });
      return {
        ...base,
        extractStatus: 'success',
        blocks,
        extractSummary: `${input.name} 已抽取 ${blocks.length} 个文本块`
      };
    }

    return {
      ...base,
      extractStatus: 'error',
      extractError: '未提供可提取内容'
    };
  } catch (error) {
    return {
      ...base,
      extractStatus: 'error',
      extractError: error instanceof Error ? error.message : '提取失败'
    };
  }
}
