import { ActionPanel } from '@/components/workbench/ActionPanel';
import { PreviewCanvas } from '@/components/workbench/PreviewCanvas';
import { SourcePanel } from '@/components/workbench/SourcePanel';
import { StageProgress } from '@/components/workbench/StageProgress';
import { StructurePanel } from '@/components/workbench/StructurePanel';
import { VariantSwitcher } from '@/components/workbench/VariantSwitcher';
import { createImageProvider } from '@/services/ai/image-provider';
import { buildDraftVariants } from '@/services/drafts/draft-service';
import { useProjectStore } from '@/stores/project-store';
import { useEffect, useState } from 'react';

export default function WorkbenchPage() {
  const project = useProjectStore((state) => state.currentProject);
  const setVariants = useProjectStore((state) => state.setVariants);
  const [saveMessage, setSaveMessage] = useState('');
  const [imageConfig, setImageConfig] = useState({
    baseUrl: 'https://free.codesonline.dev/v1',
    apiKey: '',
    model: 'gpt-image-2' as const,
    responseFormat: 'url' as const
  });
  const pageTitles = project?.structure.length ? project.structure.map((page) => page.title) : ['封面', '核心结论', '方案对比'];
  const variants = buildDraftVariants(pageTitles);

  useEffect(() => {
    window.desktopBridge?.getImageProviderConfig().then((config) => {
      if (config && typeof config === 'object') {
        setImageConfig(config as typeof imageConfig);
      }
    });
  }, []);

  async function handleGenerateImage(input: { mode: 'generate' | 'edit'; prompt: string; size: string; upscale?: '2k' | '4k' }) {
    if (!imageConfig.apiKey) {
      return null;
    }

    const provider = createImageProvider(fetch, imageConfig);
    if (input.mode === 'edit') {
      return null;
    }

    const result = await provider.generate({ prompt: input.prompt, size: input.size, upscale: input.upscale, n: 1 });
    return result?.data?.[0]?.url ?? null;
  }

  return (
    <main>
      <StageProgress />
      <section className="workbench-grid">
        <aside>
          <SourcePanel title="资料区" />
          <StructurePanel />
        </aside>
        <section>
          <VariantSwitcher variants={variants} />
          <PreviewCanvas title="预览区" projectName={project?.name} pageTitles={pageTitles} />
        </section>
        <aside>
          <ActionPanel title="能力区" onGenerateImage={handleGenerateImage} />
          <button
            type="button"
            onClick={() => {
              setVariants(variants);
              setSaveMessage(`已保存 ${variants.length} 个版本`);
            }}
          >
            保存当前版本
          </button>
          {saveMessage ? <p>{saveMessage}</p> : null}
        </aside>
      </section>
    </main>
  );
}
