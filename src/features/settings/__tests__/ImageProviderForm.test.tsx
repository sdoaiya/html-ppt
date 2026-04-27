import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { ImageProviderForm } from '@/components/settings/ImageProviderForm';

test('submits custom base url and api key', async () => {
  const onSave = vi.fn();
  render(<ImageProviderForm initial={{ baseUrl: '', apiKey: '', model: 'gpt-image-2' }} onSave={onSave} />);

  await userEvent.type(screen.getByLabelText('Base URL'), 'https://free.codesonline.dev/v1');
  await userEvent.type(screen.getByLabelText('API Key'), 'sk-test');
  await userEvent.click(screen.getByRole('button', { name: '保存配置' }));

  expect(onSave).toHaveBeenCalledWith({
    baseUrl: 'https://free.codesonline.dev/v1',
    apiKey: 'sk-test',
    model: 'gpt-image-2',
    responseFormat: 'url'
  });
});
