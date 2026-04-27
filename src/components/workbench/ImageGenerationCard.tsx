import { useState } from 'react';

type Props = {
  initialPrompt?: string;
  onGenerate?: (input: { mode: 'generate' | 'edit'; prompt: string; size: string; upscale?: '2k' | '4k' }) => Promise<string | null>;
};

export function ImageGenerationCard({ initialPrompt = '', onGenerate }: Props) {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [size, setSize] = useState('16:9');
  const [upscale, setUpscale] = useState('');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState('');

  return (
    <section className="image-generation-card">
      <h3>图片生成</h3>
      <label>
        生成模式
        <select value={mode} onChange={(event) => setMode(event.target.value as 'generate' | 'edit')}>
          <option value="generate">文生图</option>
          <option value="edit">图生图</option>
        </select>
      </label>
      <label>
        输出尺寸
        <select aria-label="输出尺寸" value={size} onChange={(event) => setSize(event.target.value)}>
          <option value="16:9">16:9</option>
          <option value="1:1">1:1</option>
          <option value="9:16">9:16</option>
          <option value="2048x1152">2048x1152</option>
        </select>
      </label>
      <label>
        高清放大
        <select value={upscale} onChange={(event) => setUpscale(event.target.value)}>
          <option value="">原始尺寸</option>
          <option value="2k">2K</option>
          <option value="4k">4K</option>
        </select>
      </label>
      <p>2K / 4K 是本地放大，不是重新绘制纹理细节。</p>
      <textarea
        aria-label="图片提示词"
        placeholder="描述你想生成的图像"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
      <button
        type="button"
        onClick={async () => {
          if (!onGenerate) return;
          setStatus('生成中...');
          const url = await onGenerate({ mode, prompt, size, upscale: upscale ? (upscale as '2k' | '4k') : undefined });
          setPreviewUrl(url ?? '');
          setStatus(url ? '生成完成' : '未生成图片');
        }}
      >
        生成图片
      </button>
      {status ? <p>{status}</p> : null}
      {previewUrl ? <img className="generated-preview" src={previewUrl} alt="生成结果" /> : null}
    </section>
  );
}
