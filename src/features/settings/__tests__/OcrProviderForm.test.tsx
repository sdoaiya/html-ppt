import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, test, expect } from 'vitest';
import { OcrProviderForm } from '@/components/settings/OcrProviderForm';

test('submits custom OCR api url key and model', async () => {
  const onSave = vi.fn();
  render(
    <OcrProviderForm
      initial={{
        apiUrl: 'https://paddleocr.aistudio-app.com/api/v2/ocr/jobs',
        apiKey: '',
        model: 'PaddleOCR-VL-1.5'
      }}
      onSave={onSave}
    />
  );

  await userEvent.clear(screen.getByLabelText('OCR API URL'));
  await userEvent.type(screen.getByLabelText('OCR API URL'), 'https://example.com/ocr');
  await userEvent.type(screen.getByLabelText('OCR API Key'), 'ocr-test-key');
  await userEvent.clear(screen.getByLabelText('OCR Model'));
  await userEvent.type(screen.getByLabelText('OCR Model'), 'PaddleOCR-VL-2.0');
  await userEvent.click(screen.getByRole('button', { name: '保存 OCR 配置' }));

  expect(onSave).toHaveBeenCalledWith({
    apiUrl: 'https://example.com/ocr',
    apiKey: 'ocr-test-key',
    model: 'PaddleOCR-VL-2.0'
  });
});
