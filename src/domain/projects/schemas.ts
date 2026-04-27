import { z } from 'zod';

export const projectStageSchema = z.enum([
  'import',
  'understanding',
  'structure',
  'direction',
  'workbench',
  'export'
]);

export const sourceAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['document', 'spreadsheet', 'image', 'audio', 'archive']),
  path: z.string(),
  status: z.enum(['ready', 'parsing', 'conflict', 'low_quality'])
});

export const structureNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  role: z.enum(['cover', 'conclusion', 'background', 'comparison', 'process', 'data', 'proof', 'closing']),
  bullets: z.array(z.string())
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  stage: projectStageSchema,
  brief: z.string(),
  sources: z.array(sourceAssetSchema),
  understanding: z.unknown().nullable(),
  structure: z.array(structureNodeSchema),
  variants: z.array(z.unknown())
});
