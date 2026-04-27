import { ImageProviderForm, type ImageProviderFormValue } from '@/components/settings/ImageProviderForm';
import { useEffect, useState } from 'react';

const defaultConfig: ImageProviderFormValue = {
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
};

export default function SettingsPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    window.desktopBridge?.getImageProviderConfig().then((value) => {
      if (value && typeof value === 'object') {
        setConfig(value as ImageProviderFormValue);
      }
    });
  }, []);

  return (
    <main>
      <h2>图片生成配置</h2>
      <section className="panel">
        <h3>连接状态</h3>
        <p>Base URL：{config.baseUrl}</p>
        <p>API Key：{config.apiKey ? '已配置' : '未配置'}</p>
        <p>模型：{config.model}</p>
        {saveMessage ? <p>{saveMessage}</p> : null}
      </section>
      <ImageProviderForm
        initial={config}
        onSave={(value) => {
          window.desktopBridge?.setImageProviderConfig(value);
          setConfig(value);
          setSaveMessage('配置已保存，可返回工作台生成图片');
        }}
      />
    </main>
  );
}
