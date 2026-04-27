import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { UnderstandingProviderForm } from '@/components/settings/UnderstandingProviderForm';

test('saves provider, baseUrl, apiKey, and model for understanding provider', async () => {
  const onSave = vi.fn();
  render(
    <UnderstandingProviderForm
      initial={{ provider: 'openai_compatible', baseUrl: '', apiKey: '', model: '' }}
      onSave={onSave}
    />
  );

  await userEvent.selectOptions(screen.getByLabelText('理解模型 Provider'), 'openrouter');
  await userEvent.type(screen.getByLabelText('理解模型 API Key'), 'sk-or-test');
  await userEvent.type(screen.getByLabelText('理解模型 Model'), 'openrouter/auto');
  await userEvent.click(screen.getByRole('button', { name: '保存理解模型' }));

  expect(onSave).toHaveBeenCalledWith({
    provider: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: 'sk-or-test',
    model: 'openrouter/auto'
  });
});

test('prefills OpenRouter base url when provider switches to openrouter', async () => {
  render(
    <UnderstandingProviderForm
      initial={{ provider: 'openai_compatible', baseUrl: '', apiKey: '', model: '' }}
      onSave={vi.fn()}
    />
  );

  await userEvent.selectOptions(screen.getByLabelText('理解模型 Provider'), 'openrouter');
  expect(screen.getByLabelText('理解模型 Base URL')).toHaveValue('https://openrouter.ai/api/v1');
});
