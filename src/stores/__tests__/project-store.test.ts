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
});
