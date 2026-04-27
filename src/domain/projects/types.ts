export type ProjectStage =
  | 'import'
  | 'understanding'
  | 'structure'
  | 'direction'
  | 'workbench'
  | 'export';

export type SourceAsset = {
  id: string;
  name: string;
  kind: 'document' | 'spreadsheet' | 'image' | 'audio' | 'archive';
  path: string;
  status: 'ready' | 'parsing' | 'conflict' | 'low_quality';
};

export type StructureNode = {
  id: string;
  title: string;
  role: 'cover' | 'conclusion' | 'background' | 'comparison' | 'process' | 'data' | 'proof' | 'closing';
  bullets: string[];
};

export type Project = {
  id: string;
  name: string;
  stage: ProjectStage;
  brief: string;
  sources: SourceAsset[];
  understanding: unknown | null;
  structure: StructureNode[];
  variants: unknown[];
};
