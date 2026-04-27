import { create } from 'zustand';
import { createEmptyProject } from '@/domain/projects/factories';
import type { Project, ProjectStage } from '@/domain/projects/types';

type ProjectStore = {
  currentProject: Project | null;
  createProject: (name: string, brief: string) => void;
  setStage: (stage: ProjectStage) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  createProject: (name, brief) => set({ currentProject: createEmptyProject(name, brief) }),
  setStage: (stage) =>
    set((state) => ({
      currentProject: state.currentProject ? { ...state.currentProject, stage } : null
    }))
}));
