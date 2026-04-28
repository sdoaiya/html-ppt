import { useNavigate } from 'react-router-dom';
import { buildUnderstandingWithAi } from '@/services/ai/understanding-client';
import { buildUnderstanding } from '@/services/understanding/understanding-service';
import { useProjectStore } from '@/stores/project-store';
import { useEffect, useState } from 'react';

export default function UnderstandingPage() {
  const project = useProjectStore((state) => state.currentProject);
  const setStage = useProjectStore((state) => state.setStage);
  const setUnderstanding = useProjectStore((state) => state.setUnderstanding);
  const navigate = useNavigate();
  const [understanding, setLocalUnderstanding] = useState(
    buildUnderstanding({ brief: project?.brief ?? '整理成业务资料', sources: project?.sources ?? [] })
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);

      const rawConfig = await window.desktopBridge?.getUnderstandingProviderConfig?.();
      const config = rawConfig && typeof rawConfig === 'object'
        ? (rawConfig as { provider?: string; baseUrl?: string; apiKey?: string; model?: string })
        : null;

      const aiResult = await buildUnderstandingWithAi({
        brief: project?.brief ?? '整理成业务资料',
        sources: project?.sources ?? [],
        config: config?.apiKey ? {
          provider: (config.provider as 'openai_compatible' | 'openrouter') ?? 'openai_compatible',
          baseUrl: config.baseUrl ?? '',
          apiKey: config.apiKey,
          model: config.model ?? ''
        } : undefined
      });

      if (aiResult) {
        setLocalUnderstanding(aiResult);
      }

      setIsLoading(false);
    };

    void run();
  }, [project]);

  return (
    <main className="flow-page">
      <h2>理解资料</h2>
      <p className="page-intro">{understanding.summary}</p>
      {isLoading ? <p>正在调用理解模型分析资料...</p> : null}
      <section className="panel flow-section">
        <h3>已导入资料</h3>
        <p>这些资料将作为当前内容生成输入。</p>
        <ul>
          {(project?.sources ?? []).map((source) => (
            <li key={source.id}>
              <strong>{source.name}</strong>
              {source.extractSummary ? <span> {source.extractSummary}</span> : null}
            </li>
          ))}
        </ul>
      </section>
      <section className="panel flow-section">
        <h3>系统建议</h3>
        <p>以下内容适合转成图表、对比页或流程页。</p>
        <ul>
          {understanding.visualizable.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <button
        onClick={() => {
          setUnderstanding(understanding);
          setStage('structure');
          navigate('/structure');
        }}
      >
        生成结构
      </button>
    </main>
  );
}
