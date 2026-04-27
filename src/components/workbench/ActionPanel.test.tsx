import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ActionPanel } from './ActionPanel';

test('shows image generation controls', () => {
  render(<ActionPanel title="能力区" />);
  expect(screen.getByText('图片生成')).toBeInTheDocument();
  expect(screen.getByLabelText('输出尺寸')).toBeInTheDocument();
});
