import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '@/features/settings/pages/SettingsPage';

beforeEach(() => {
  window.desktopBridge = {
    platform: 'win32',
    version: '0.1.0',
    pickProjectFiles: vi.fn(),
    readProjectFiles: vi.fn(),
    getOcrProviderConfig: vi.fn().mockResolvedValue({
      apiUrl: 'https://paddleocr.aistudio-app.com/api/v2/ocr/jobs',
      apiKey: '',
      model: 'PaddleOCR-VL-1.5'
    }),
    setOcrProviderConfig: vi.fn(),
    getUnderstandingProviderConfig: vi.fn().mockResolvedValue({
      provider: 'openrouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: '',
      model: 'openrouter/auto'
    }),
    setUnderstandingProviderConfig: vi.fn(),
    getImageProviderConfig: vi.fn().mockResolvedValue({
      baseUrl: 'https://free.codesonline.dev/v1',
      apiKey: '',
      model: 'gpt-image-2',
      responseFormat: 'url'
    }),
    setImageProviderConfig: vi.fn(),
    exportProjectJson: vi.fn()
  };
});

test('renders OCR settings form fields', async () => {
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  );

  expect(await screen.findByLabelText('OCR API URL')).toBeInTheDocument();
  expect(screen.getByLabelText('OCR API Key')).toBeInTheDocument();
  expect(screen.getByLabelText('OCR Model')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '保存 OCR 配置' })).toBeInTheDocument();
});
