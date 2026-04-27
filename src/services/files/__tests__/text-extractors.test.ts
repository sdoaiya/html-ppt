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
});
