import { describe, expect, it } from 'vitest';
import { classifyImportedFile, createExtractedSourceAsset } from '../import-service';

describe('classifyImportedFile', () => {
  it('classifies pptx as document-like asset', () => {
    expect(classifyImportedFile('招商方案.pptx')).toBe('document');
  });

  it('classifies png as image asset', () => {
    expect(classifyImportedFile('cover.png')).toBe('image');
  });

  it('creates extracted source assets with content blocks', async () => {
    const result = await createExtractedSourceAsset({
      path: 'note.txt',
      name: 'note.txt',
      kind: 'document',
      rawContent: '第一段\n\n第二段'
    });

    expect(result.extractStatus).toBe('success');
    expect(result.blocks?.length).toBe(2);
  });
});
