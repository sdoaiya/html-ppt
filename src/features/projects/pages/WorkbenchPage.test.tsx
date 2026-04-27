import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import WorkbenchPage from './WorkbenchPage';

test('renders three-pane workbench', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('资料区')).toBeInTheDocument();
  expect(screen.getByText('预览区')).toBeInTheDocument();
  expect(screen.getByText('能力区')).toBeInTheDocument();
});
