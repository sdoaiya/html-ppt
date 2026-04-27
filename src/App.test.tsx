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
  expect(screen.getByRole('link', { name: '设置' })).toBeInTheDocument();
});

test('shows recent project card when project history exists', () => {
  useProjectStore.getState().createProject('招商资料演示', '做成招商汇报');
  render(<App />);
  expect(screen.getByText('最近项目')).toBeInTheDocument();
  expect(screen.getByText('招商资料演示')).toBeInTheDocument();
});
