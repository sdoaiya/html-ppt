import type { ContentBlock } from '@/domain/projects/types';

export async function extractTextBlocks(input: {
  kind: 'document';
  name: string;
  content: string;
}): Promise<ContentBlock[]> {
  return input.content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((text) => {
      if (text.startsWith('# ')) {
        return { type: 'heading', text: text.slice(2).trim() } as ContentBlock;
      }
      return { type: 'paragraph', text } as ContentBlock;
    });
}
