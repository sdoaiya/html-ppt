import type { SourceAsset } from '@/domain/projects/types';

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
