import type { Project } from './types';

export function createEmptyProject(name: string, brief: string): Project {
  return {
    id: crypto.randomUUID(),
    name,
    stage: 'import',
    brief,
    deliverableType: null,
    sources: [],
    understanding: null,
    structure: [],
    variants: []
  };
}
