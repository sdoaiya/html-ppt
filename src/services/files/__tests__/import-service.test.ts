import { describe, expect, it } from 'vitest';
import { classifyImportedFile } from '../import-service';

describe('classifyImportedFile', () => {
  it('classifies pptx as document-like asset', () => {
    expect(classifyImportedFile('招商方案.pptx')).toBe('document');
  });

  it('classifies png as image asset', () => {
    expect(classifyImportedFile('cover.png')).toBe('image');
  });
});
