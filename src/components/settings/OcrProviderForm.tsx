import { useEffect, useState } from 'react';

export type OcrProviderFormValue = {
  apiUrl: string;
  apiKey: string;
  model: string;
};

type Props = {
  initial: OcrProviderFormValue;
  onSave: (value: OcrProviderFormValue) => void;
};

export function OcrProviderForm({ initial, onSave }: Props) {
  const [apiUrl, setApiUrl] = useState(initial.apiUrl);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [model, setModel] = useState(initial.model);

  useEffect(() => {
    setApiUrl(initial.apiUrl);
    setApiKey(initial.apiKey);
    setModel(initial.model);
  }, [initial]);

  return (
    <form
      className="settings-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ apiUrl, apiKey, model });
      }}
    >
      <h3>OCR 配置</h3>
      <p>用于扫描版 PDF 的文字识别回退。</p>
      <label>
        OCR API URL
        <input aria-label="OCR API URL" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} />
      </label>
      <label>
        OCR API Key
        <input aria-label="OCR API Key" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
      </label>
      <label>
        OCR Model
        <input aria-label="OCR Model" value={model} onChange={(event) => setModel(event.target.value)} />
      </label>
      <button type="submit">保存 OCR 配置</button>
    </form>
  );
}
