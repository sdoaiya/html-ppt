import { OcrProviderForm, type OcrProviderFormValue } from '@/components/settings/OcrProviderForm';
import { ImageProviderForm, type ImageProviderFormValue } from '@/components/settings/ImageProviderForm';
import { UnderstandingProviderForm, type UnderstandingProviderFormValue } from '@/components/settings/UnderstandingProviderForm';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type OcrConfig = OcrProviderFormValue;

const defaultUnderstandingConfig: UnderstandingProviderFormValue = {
  provider: 'openai_compatible',
  baseUrl: '',
  apiKey: '',
  model: ''
};

const defaultConfig: ImageProviderFormValue = {
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
};

export default function SettingsPage() {
  const [ocrConfig, setOcrConfig] = useState<OcrConfig>({
    apiUrl: 'https://paddleocr.aistudio-app.com/api/v2/ocr/jobs',
    apiKey: '',
    model: 'PaddleOCR-VL-1.5'
  });
  const [understandingConfig, setUnderstandingConfig] = useState(defaultUnderstandingConfig);
  const [config, setConfig] = useState(defaultConfig);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    window.desktopBridge?.getOcrProviderConfig?.().then((value) => {
      if (value && typeof value === 'object') {
        setOcrConfig(value as OcrConfig);
      }
    });
    window.desktopBridge?.getUnderstandingProviderConfig?.().then((value) => {
      if (value && typeof value === 'object') {
        setUnderstandingConfig(value as UnderstandingProviderFormValue);
      }
    });
    window.desktopBridge?.getImageProviderConfig().then((value) => {
      if (value && typeof value === 'object') {
        setConfig(value as ImageProviderFormValue);
      }
    });
  }, []);

  return (
    <main>
      <h2>图片生成配置</h2>
      <Link to="/" className="nav-back">&larr; 返回首页</Link>
      <section className="panel">
        <h3>连接状态</h3>
        <p>OCR：{ocrConfig.apiKey ? '已配置' : '未配置'}</p>
        <p>理解模型：{understandingConfig.apiKey ? '已配置' : '未配置'}</p>
        <p>Base URL：{config.baseUrl}</p>
        <p>API Key：{config.apiKey ? '已配置' : '未配置'}</p>
        <p>模型：{config.model}</p>
        {saveMessage ? <p>{saveMessage}</p> : null}
      </section>
      <section className="settings-grid">
        <UnderstandingProviderForm
          initial={understandingConfig}
          onSave={(value) => {
            window.desktopBridge?.setUnderstandingProviderConfig?.(value);
            setUnderstandingConfig(value);
            setSaveMessage('理解模型配置已保存');
          }}
        />
        <OcrProviderForm
          initial={ocrConfig}
          onSave={(value) => {
            window.desktopBridge?.setOcrProviderConfig?.(value);
            setOcrConfig(value);
            setSaveMessage('OCR 配置已保存');
          }}
        />
        <ImageProviderForm
          initial={config}
          onSave={(value) => {
            window.desktopBridge?.setImageProviderConfig(value);
            setConfig(value);
            setSaveMessage('生图模型配置已保存，可返回工作台生成图片');
          }}
        />
      </section>
    </main>
  );
}
