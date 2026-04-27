import type { ExtractedSourceAsset } from '@/domain/projects/types';
import type { UnderstandingResult } from '@/services/understanding/understanding-service';

export async function buildUnderstandingWithAi(_input: {
  brief: string;
  sources: ExtractedSourceAsset[];
}): Promise<UnderstandingResult | null> {
  return null;
}
