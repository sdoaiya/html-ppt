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

export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet_list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'table_summary'; text: string };

export type ExtractedSourceAsset = SourceAsset & {
  extractStatus?: 'pending' | 'success' | 'error';
  blocks?: ContentBlock[];
  extractSummary?: string;
  extractError?: string;
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
  sources: ExtractedSourceAsset[];
  understanding: unknown | null;
  structure: StructureNode[];
  variants: Array<{ id: string; label: string; pages: Array<{ title: string; tone: string; density: string }> }>;
};
