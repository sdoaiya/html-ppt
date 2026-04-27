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
    <main>
      <h2>理解资料</h2>
      <p>{understanding.summary}</p>
      <section>
        <h3>已导入资料</h3>
        <ul>
          {(project?.sources ?? []).map((source) => (
            <li key={source.id}>{source.name}</li>
          ))}
        </ul>
      </section>
      <ul>
        {understanding.visualizable.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
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
