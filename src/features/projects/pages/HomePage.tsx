import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

export default function HomePage() {
  const navigate = useNavigate();
  const recentProjects = useProjectStore((state) => state.recentProjects);

  return (
    <main className="home-page">
      <section className="hero-card">
        <div>
          <h2>让不懂设计的人，也能把杂乱资料快速做成高质量业务资料</h2>
          <p>从资料导入、AI 理解到版式生成与配图，一条链路完成资料生产。</p>
        </div>
        <button onClick={() => navigate('/import')}>新建项目</button>
      </section>

      <section className="home-grid">
        <section className="home-section">
          <h3>快速开始</h3>
          <ul className="quick-types">
            <li onClick={() => navigate('/import')}>汇报材料</li>
            <li onClick={() => navigate('/import')}>招商方案</li>
            <li onClick={() => navigate('/import')}>产品介绍</li>
            <li onClick={() => navigate('/import')}>长图 / 信息页</li>
          </ul>
        </section>
        <section className="home-section">
          <h3>最近项目</h3>
          {recentProjects.length ? (
            <ul className="recent-projects">
              {recentProjects.map((project) => (
                <li key={project.id}>
                  <strong>{project.name}</strong>
                  <span>{project.stage}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>还没有最近项目，先新建一个。</p>
          )}
        </section>
      </section>
    </main>
  );
}
