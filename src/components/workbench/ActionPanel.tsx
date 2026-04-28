type Props = { title: string };
import { ImageGenerationCard } from './ImageGenerationCard';
import { useState } from 'react';

type ActionPanelProps = Props & {
  initialPrompt?: string;
  onGenerateImage?: (input: { mode: 'generate' | 'edit'; prompt: string; size: string; upscale?: '2k' | '4k' }) => Promise<string | null>;
  onRefreshPrompt?: () => void;
  onCheckIssues?: () => void;
};

export function ActionPanel({ title, initialPrompt, onGenerateImage, onRefreshPrompt, onCheckIssues }: ActionPanelProps) {
  const [actionMessage, setActionMessage] = useState('');

  return (
    <section className="panel">
      <h3>{title}</h3>
      <section className="action-group">
        <h4>内容与视觉</h4>
        <button
          type="button"
          onClick={() => {
            onRefreshPrompt?.();
            setActionMessage('已为当前页面生成优化提示词');
          }}
        >
          更高级
        </button>
        <button
          type="button"
          onClick={() => {
            onRefreshPrompt?.();
            setActionMessage('已统一页面风格参数');
          }}
        >
          全局统一
        </button>
        <button
          type="button"
          onClick={() => {
            onCheckIssues?.();
          }}
        >
          检查问题页
        </button>
        {actionMessage ? <p>{actionMessage}</p> : null}
      </section>
      <ImageGenerationCard initialPrompt={initialPrompt} onGenerate={onGenerateImage} />
    </section>
  );
}
