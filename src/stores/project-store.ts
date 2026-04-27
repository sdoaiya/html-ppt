import { create } from 'zustand';
import { createEmptyProject } from '@/domain/projects/factories';
import type { ExtractedSourceAsset, Project, ProjectStage, SourceAsset, StructureNode } from '@/domain/projects/types';

type ProjectStore = {
  currentProject: Project | null;
  recentProjects: Project[];
  createProject: (name: string, brief: string) => void;
  setStage: (stage: ProjectStage) => void;
  setSources: (sources: SourceAsset[]) => void;
  setExtractedSources: (sources: ExtractedSourceAsset[]) => void;
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
  recentProjects: [],
  createProject: (name, brief) =>
    set((state) => {
      const project = createEmptyProject(name, brief);
      return {
        currentProject: project,
        recentProjects: [project, ...state.recentProjects.filter((item) => item.id !== project.id)].slice(0, 6)
      };
    }),
  setStage: (stage) =>
    set(updateProject((project) => ({ ...project, stage }))),
  setSources: (sources) => set(updateProject((project) => ({ ...project, sources }))),
  setExtractedSources: (sources) => set(updateProject((project) => ({ ...project, sources }))),
  setUnderstanding: (understanding) => set(updateProject((project) => ({ ...project, understanding }))),
  setStructure: (structure) => set(updateProject((project) => ({ ...project, structure }))),
  setVariants: (variants) => set(updateProject((project) => ({ ...project, variants })))
}));
