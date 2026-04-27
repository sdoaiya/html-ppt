import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, test, expect } from 'vitest';
import { useProjectStore } from '@/stores/project-store';
import WorkbenchPage from './WorkbenchPage';

beforeEach(() => {
  useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
  useProjectStore.getState().setStructure([
    { id: 's1', title: '封面', role: 'cover', bullets: ['招商资料'] },
    { id: 's2', title: '方案对比', role: 'comparison', bullets: ['当前方式 vs 新方式'] }
  ]);
});

test('renders three-pane workbench', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('资料区')).toBeInTheDocument();
  expect(screen.getByText('预览区')).toBeInTheDocument();
  expect(screen.getByText('能力区')).toBeInTheDocument();
});

test('renders project-specific pages from shared project state', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('招商资料演示')).toBeInTheDocument();
  expect(screen.getByText('方案对比')).toBeInTheDocument();
});

test('shows feedback after saving current variants', async () => {
  render(<WorkbenchPage />);
  await userEvent.click(screen.getByRole('button', { name: '保存当前版本' }));
  expect(screen.getByText('已保存 2 个版本')).toBeInTheDocument();
});
