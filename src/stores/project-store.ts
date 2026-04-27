import { create } from 'zustand';
import { createEmptyProject } from '@/domain/projects/factories';
import type { Project, ProjectStage, SourceAsset, StructureNode } from '@/domain/projects/types';

type ProjectStore = {
  currentProject: Project | null;
  createProject: (name: string, brief: string) => void;
  setStage: (stage: ProjectStage) => void;
  setSources: (sources: SourceAsset[]) => void;
  setUnderstanding: (understanding: unknown) => void;
  setStructure: (structure: StructureNode[]) => void;
  setVariants: (variants: unknown[]) => void;
};

function updateProject(updater: (project: Project) => Project) {
  return (state: ProjectStore) => ({
    currentProject: state.currentProject ? updater(state.currentProject) : null
  });
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  createProject: (name, brief) => set({ currentProject: createEmptyProject(name, brief) }),
  setStage: (stage) =>
    set(updateProject((project) => ({ ...project, stage }))),
  setSources: (sources) => set(updateProject((project) => ({ ...project, sources }))),
  setUnderstanding: (understanding) => set(updateProject((project) => ({ ...project, understanding }))),
  setStructure: (structure) => set(updateProject((project) => ({ ...project, structure }))),
  setVariants: (variants) => set(updateProject((project) => ({ ...project, variants })))
}));
