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

  it('produces error status when no extractable content is provided', async () => {
    const result = await createExtractedSourceAsset({
      path: 'empty.bin',
      name: 'empty.bin',
      kind: 'archive'
    });

    expect(result.extractStatus).toBe('error');
  });

  it('handles docx-style extracted text paragraphs', async () => {
    const result = await createExtractedSourceAsset({
      path: 'report.docx',
      name: 'report.docx',
      kind: 'document',
      rawContent: '摘要段落\n\n正文内容'
    });

    expect(result.extractStatus).toBe('success');
    expect(result.blocks?.length).toBe(2);
    expect(result.extractSummary).toContain('已抽取');
  });

  it('handles pdf-style extracted text blocks', async () => {
    const result = await createExtractedSourceAsset({
      path: 'brochure.pdf',
      name: 'brochure.pdf',
      kind: 'document',
      rawContent: '第一页内容\n\n第二页内容'
    });

    expect(result.extractStatus).toBe('success');
    expect(result.blocks?.[0]).toMatchObject({ type: 'paragraph', text: '第一页内容' });
  });

  it('handles xlsx-style table rows', async () => {
    const result = await createExtractedSourceAsset({
      path: 'data.xlsx',
      name: 'data.xlsx',
      kind: 'spreadsheet',
      rows: [
        ['产品', '销量'],
        ['A', '100'],
        ['B', '200']
      ]
    });

    expect(result.extractStatus).toBe('success');
    expect(result.blocks?.[0]).toMatchObject({ type: 'table' });
    expect(result.blocks?.[1]).toMatchObject({ type: 'table_summary' });
  });
});
