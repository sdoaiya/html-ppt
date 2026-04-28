import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, test, expect } from 'vitest';
import { useProjectStore } from '@/stores/project-store';
import WorkbenchPage from './WorkbenchPage';

function renderWorkbench() {
  return render(
    <MemoryRouter>
      <WorkbenchPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
  useProjectStore.getState().setExtractedSources([
    {
      id: 'f1',
      name: '业务介绍.txt',
      kind: 'document',
      path: '业务介绍.txt',
      status: 'ready',
      extractStatus: 'success',
      extractSummary: '业务介绍.txt 已抽取 2 个文本块',
      blocks: [{ type: 'paragraph', text: '业务优势是渠道覆盖全国' }]
    }
  ]);
  useProjectStore.getState().setStructure([
    { id: 's1', title: '封面', role: 'cover', bullets: ['招商资料'] },
    { id: 's2', title: '方案对比', role: 'comparison', bullets: ['当前方式 vs 新方式'] }
  ]);
});

test('renders three-pane workbench', () => {
  renderWorkbench();
  expect(screen.getByText('资料区')).toBeInTheDocument();
  expect(screen.getByText('预览区')).toBeInTheDocument();
  expect(screen.getByText('能力区')).toBeInTheDocument();
});

test('renders project-specific pages from shared project state', () => {
  renderWorkbench();
  expect(screen.getByText('招商资料演示')).toBeInTheDocument();
  expect(screen.getAllByText('方案对比').length).toBeGreaterThanOrEqual(2);
});

test('shows feedback after saving current variants', async () => {
  renderWorkbench();
  await userEvent.click(screen.getByRole('button', { name: '保存当前版本' }));
  expect(screen.getByText('已保存 2 个版本')).toBeInTheDocument();
});

test('auto-fills image prompt from project context', () => {
  renderWorkbench();
  const promptTextarea = screen.getByLabelText('图片提示词');
  const value = (promptTextarea as HTMLTextAreaElement).value;
  expect(value).toContain('做成招商汇报');
  expect(value).toContain('封面');
  expect(value).toContain('16:9');
});

test('shows cover and comparison content slots in preview', () => {
  renderWorkbench();
  expect(screen.getByText('封面卡槽')).toBeInTheDocument();
  expect(screen.getByText('对比页卡槽')).toBeInTheDocument();
});

test('shows desktop-style canvas metadata in preview', () => {
  renderWorkbench();
  expect(screen.getByText('当前结果预览')).toBeInTheDocument();
});

test('shows extracted source names and summaries in workbench source panel', () => {
  renderWorkbench();
  expect(screen.getByText('业务介绍.txt')).toBeInTheDocument();
  expect(screen.getByText('业务介绍.txt 已抽取 2 个文本块')).toBeInTheDocument();
});
