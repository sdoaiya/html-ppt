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
    .map((text) => ({ type: 'paragraph', text }));
}
