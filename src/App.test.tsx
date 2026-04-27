import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application title', () => {
  render(<App />);
  expect(screen.getByText('资料生产工作台')).toBeInTheDocument();
});
