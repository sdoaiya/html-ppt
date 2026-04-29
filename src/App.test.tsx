import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useProjectStore } from '@/stores/project-store';
import App from './App';

beforeEach(() => {
  useProjectStore.setState({
    currentProject: null,
    recentProjects: []
  });
});

test('renders application title', () => {
  render(<App />);
  expect(screen.getByText('资料生产工作台')).toBeInTheDocument();
});

test('renders new project entry action', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: '新建项目' })).toBeInTheDocument();
});

test('renders settings entry in app shell', () => {
  render(<App />);
  expect(screen.getByText('⚙ 设置')).toBeInTheDocument();
});

test('shows recent project card when project history exists', () => {
  useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
  render(<App />);
  expect(screen.getByText('最近项目')).toBeInTheDocument();
  expect(screen.getAllByText('招商资料演示').length).toBeGreaterThanOrEqual(2);
});

test('shows current project area in top bar when project exists', () => {
  useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
  render(<App />);
  expect(screen.getAllByText('招商资料演示').length).toBeGreaterThanOrEqual(2);
});

test('renders desktop sidebar navigation groups', () => {
  render(<App />);
  expect(screen.getByLabelText('主导航')).toBeInTheDocument();
  expect(screen.getByText('最近项目')).toBeInTheDocument();
});
