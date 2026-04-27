import { describe, expect, it } from 'vitest';
import { extractTextBlocks } from '../text-extractors';

describe('extractTextBlocks', () => {
  it('splits plain text into paragraph blocks', async () => {
    const blocks = await extractTextBlocks({
      kind: 'document',
      name: 'note.txt',
      content: '第一段\n\n第二段'
    });

    expect(blocks).toEqual([
      { type: 'paragraph', text: '第一段' },
      { type: 'paragraph', text: '第二段' }
    ]);
  });

  it('extracts markdown headings as heading blocks', async () => {
    const blocks = await extractTextBlocks({
      kind: 'document',
      name: 'note.md',
      content: '# 标题\n\n正文段落'
    });

    expect(blocks[0]).toEqual({ type: 'heading', text: '标题' });
    expect(blocks[1]).toEqual({ type: 'paragraph', text: '正文段落' });
  });
});
