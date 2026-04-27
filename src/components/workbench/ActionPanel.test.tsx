import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ActionPanel } from './ActionPanel';

test('shows image generation controls', () => {
  render(<ActionPanel title="能力区" />);
  expect(screen.getByText('图片生成')).toBeInTheDocument();
  expect(screen.getByLabelText('输出尺寸')).toBeInTheDocument();
});

test('renders generated image preview after successful request', async () => {
  const onGenerate = vi.fn().mockResolvedValue('https://img.test/generated.png');
  render(<ActionPanel title="能力区" onGenerateImage={onGenerate} />);

  await userEvent.type(screen.getByLabelText('图片提示词'), '一张干净的产品海报');
  await userEvent.click(screen.getByRole('button', { name: '生成图片' }));

  expect(onGenerate).toHaveBeenCalled();
  expect(await screen.findByAltText('生成结果')).toHaveAttribute('src', 'https://img.test/generated.png');
});
