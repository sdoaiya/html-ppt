import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

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
