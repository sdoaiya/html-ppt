import { useNavigate } from 'react-router-dom';
import { buildStructure } from '@/services/structure/structure-service';
import { useProjectStore } from '@/stores/project-store';

export default function StructurePage() {
  const setStage = useProjectStore((state) => state.setStage);
  const setStructure = useProjectStore((state) => state.setStructure);
  const navigate = useNavigate();
  const pages = buildStructure('更适合招商/销售介绍');

  return (
    <main className="flow-page">
      <h2>组织结构</h2>
      <p className="page-intro">当前结构将驱动后续版式与配图生成。</p>
      <section className="panel flow-section">
        <h3>页面结构</h3>
        <ol>
          {pages.map((page) => (
            <li key={page.id}>
              <strong>{page.title}</strong> · {page.role}
            </li>
          ))}
        </ol>
      </section>
      <button
        onClick={() => {
          setStructure(pages);
          setStage('workbench');
          navigate('/workbench');
        }}
      >
        进入版式工作台
      </button>
    </main>
  );
}
