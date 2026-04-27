import { describe, expect, it } from 'vitest';
import { useProjectStore } from '../project-store';

describe('project store', () => {
  it('creates a new project with brief', () => {
    useProjectStore.getState().createProject('招商资料', '做成招商汇报');
    expect(useProjectStore.getState().currentProject?.name).toBe('招商资料');
  });

  it('moves project to next stage', () => {
    useProjectStore.getState().setStage('structure');
    expect(useProjectStore.getState().currentProject?.stage).toBe('structure');
  });

  it('stores sources, understanding, structure, and variants in one project flow', () => {
    useProjectStore.getState().createProject('招商资料', '做成招商汇报');
    useProjectStore.getState().setSources([
      { id: 's1', name: '旧方案.pptx', kind: 'document', path: '旧方案.pptx', status: 'ready' }
    ]);
    useProjectStore.getState().setUnderstanding({ summary: '已理解资料' });
    useProjectStore.getState().setStructure([
      { id: 'p1', title: '封面', role: 'cover', bullets: ['招商汇报'] }
    ]);
    useProjectStore.getState().setVariants([{ id: 'stable', label: '稳妥版', pages: [] }]);

    const project = useProjectStore.getState().currentProject;
    expect(project?.sources).toHaveLength(1);
    expect(project?.understanding).toEqual({ summary: '已理解资料' });
    expect(project?.structure[0].title).toBe('封面');
    expect(project?.variants[0]).toMatchObject({ id: 'stable' });
  });

  it('preserves project name while updating later fields', () => {
    useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
    useProjectStore.getState().setSources([
      { id: 's1', name: '旧方案.pptx', kind: 'document', path: '旧方案.pptx', status: 'ready' }
    ]);

    expect(useProjectStore.getState().currentProject?.name).toBe('招商资料演示');
  });
});
