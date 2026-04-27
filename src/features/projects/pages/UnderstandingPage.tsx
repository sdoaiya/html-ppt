import { useNavigate } from 'react-router-dom';
import { buildUnderstanding } from '@/services/understanding/understanding-service';
import { useProjectStore } from '@/stores/project-store';

export default function UnderstandingPage() {
  const project = useProjectStore((state) => state.currentProject);
  const setStage = useProjectStore((state) => state.setStage);
  const setUnderstanding = useProjectStore((state) => state.setUnderstanding);
  const navigate = useNavigate();
  const understanding = buildUnderstanding({ brief: project?.brief ?? '整理成业务资料', sources: project?.sources ?? [] });

  return (
    <main className="flow-page">
      <h2>理解资料</h2>
      <p className="page-intro">{understanding.summary}</p>
      <section className="panel flow-section">
        <h3>已导入资料</h3>
        <p>这些资料将作为当前内容生成输入。</p>
        <ul>
          {(project?.sources ?? []).map((source) => (
            <li key={source.id}>{source.name}</li>
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
