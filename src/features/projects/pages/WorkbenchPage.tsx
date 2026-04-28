import { ActionPanel } from '@/components/workbench/ActionPanel';
import { PreviewCanvas } from '@/components/workbench/PreviewCanvas';
import { SourcePanel } from '@/components/workbench/SourcePanel';
import { StageProgress } from '@/components/workbench/StageProgress';
import { StructurePanel } from '@/components/workbench/StructurePanel';
import { VariantSwitcher } from '@/components/workbench/VariantSwitcher';
import { createImageProvider } from '@/services/ai/image-provider';
import { autoBuildPagePrompt } from '@/services/ai/prompt-builder';
import { buildDraftVariants } from '@/services/drafts/draft-service';
import { useProjectStore } from '@/stores/project-store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkbenchPage() {
  const project = useProjectStore((state) => state.currentProject);
  const setVariants = useProjectStore((state) => state.setVariants);
  const navigate = useNavigate();
  const [saveMessage, setSaveMessage] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [promptVersion, setPromptVersion] = useState(0);
  const [imageConfig, setImageConfig] = useState({
    baseUrl: 'https://free.codesonline.dev/v1',
    apiKey: '',
    model: 'gpt-image-2' as const,
    responseFormat: 'url' as const
  });
  const pageTitles = project?.structure.length ? project.structure.map((page) => page.title) : ['封面', '核心结论', '方案对比'];
  const variants = buildDraftVariants(pageTitles);

  const autoPrompt = useMemo(() => {
    if (!project || project.structure.length === 0) return '';
    const firstPage = project.structure[0];
    return autoBuildPagePrompt(project.brief, firstPage.title, firstPage.role);
  }, [project, promptVersion]);

  const handleRefreshPrompt = useCallback(() => {
    setPromptVersion((version) => version + 1);
  }, []);

  const handleCheckIssues = useCallback(() => {
    navigate('/export');
  }, [navigate]);

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
    const url = result?.data?.[0]?.url ?? null;
    if (url) setGeneratedImageUrl(url);
    return url;
  }

  return (
    <main>
      <StageProgress />
      <section className="workbench-grid">
        <aside>
          <SourcePanel title="资料区" sources={project?.sources} />
          <StructurePanel pages={project?.structure} />
        </aside>
        <section>
          <VariantSwitcher variants={variants} />
          <PreviewCanvas title="预览区" projectName={project?.name} pageTitles={pageTitles} generatedImageUrl={generatedImageUrl} />
        </section>
        <aside>
          <ActionPanel title="能力区" initialPrompt={autoPrompt} onGenerateImage={handleGenerateImage} onRefreshPrompt={handleRefreshPrompt} onCheckIssues={handleCheckIssues} />
          <section className="panel status-panel">
            <h3>状态与保存</h3>
            <button
              type="button"
              onClick={() => {
                setVariants(variants);
                setSaveMessage(`已保存 ${variants.length} 个版本`);
              }}
            >
              保存当前版本
            </button>
            {imageConfig.apiKey ? <p>图片服务已连接</p> : <p>请先到设置页配置 API Key</p>}
            {saveMessage ? <p>{saveMessage}</p> : <p>当前版本尚未保存</p>}
          </section>
        </aside>
      </section>
    </main>
  );
}
