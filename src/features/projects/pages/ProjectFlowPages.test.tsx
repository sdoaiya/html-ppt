import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, test, expect } from 'vitest';
import { useProjectStore } from '@/stores/project-store';
import UnderstandingPage from './UnderstandingPage';
import StructurePage from './StructurePage';
import ExportPage from './ExportPage';

beforeEach(() => {
  useProjectStore.setState({
    currentProject: null,
    recentProjects: []
  });
  useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
  useProjectStore.getState().setSources([
    { id: 's1', name: '旧方案.pptx', kind: 'document', path: '旧方案.pptx', status: 'ready' }
  ]);
  useProjectStore.getState().setStructure([
    { id: 'p1', title: '封面', role: 'cover', bullets: ['招商资料演示'] },
    { id: 'p2', title: '方案对比', role: 'comparison', bullets: ['当前方式 vs 新方式'] }
  ]);
});

test('understanding page shows imported materials guidance card', () => {
  render(
    <MemoryRouter>
      <UnderstandingPage />
    </MemoryRouter>
  );

  expect(screen.getByText('已导入资料')).toBeInTheDocument();
  expect(screen.getByText('这些资料将作为当前内容生成输入。')).toBeInTheDocument();
  expect(screen.getByText('系统建议')).toBeInTheDocument();
});

test('structure page shows next-step card messaging', () => {
  render(
    <MemoryRouter>
      <StructurePage />
    </MemoryRouter>
  );

  expect(screen.getByText('当前结构将驱动后续版式与配图生成。')).toBeInTheDocument();
  expect(screen.getByText('进入版式工作台')).toBeInTheDocument();
});

test('export page shows delivery checkpoint summary', () => {
  render(<ExportPage />);
  expect(screen.getByText('导出前质检')).toBeInTheDocument();
  expect(screen.getByText('请先处理高风险项，再导出项目结果。')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '导出项目 JSON' })).toBeInTheDocument();
});
