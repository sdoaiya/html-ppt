import { useNavigate } from 'react-router-dom';
import { buildStructure } from '@/services/structure/structure-service';
import { useProjectStore } from '@/stores/project-store';

export default function StructurePage() {
  const setStage = useProjectStore((state) => state.setStage);
  const navigate = useNavigate();
  const pages = buildStructure('更适合招商/销售介绍');

  return (
    <main>
      <h2>组织结构</h2>
      <ol>
        {pages.map((page) => (
          <li key={page.id}>
            <strong>{page.title}</strong> · {page.role}
          </li>
        ))}
      </ol>
      <button
        onClick={() => {
          setStage('workbench');
          navigate('/workbench');
        }}
      >
        进入版式工作台
      </button>
    </main>
  );
}
