import { ImageProviderForm, type ImageProviderFormValue } from '@/components/settings/ImageProviderForm';

const defaultConfig: ImageProviderFormValue = {
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
};

export default function SettingsPage() {
  return (
    <main>
      <h2>图片生成配置</h2>
      <ImageProviderForm
        initial={defaultConfig}
        onSave={(value) => {
          window.desktopBridge?.setImageProviderConfig(value);
        }}
      />
    </main>
  );
}
