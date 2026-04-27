type Props = { title: string };
import { ImageGenerationCard } from './ImageGenerationCard';

type ActionPanelProps = Props & {
  initialPrompt?: string;
  onGenerateImage?: (input: { mode: 'generate' | 'edit'; prompt: string; size: string; upscale?: '2k' | '4k' }) => Promise<string | null>;
};

export function ActionPanel({ title, initialPrompt, onGenerateImage }: ActionPanelProps) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <button type="button">更高级</button>
      <button type="button">全局统一</button>
      <button type="button">检查问题页</button>
      <ImageGenerationCard initialPrompt={initialPrompt} onGenerate={onGenerateImage} />
    </section>
  );
}
