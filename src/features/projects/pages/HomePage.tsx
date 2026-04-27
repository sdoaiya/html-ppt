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
          <p>从资料导入、结构生成到工作台预览与配图生成，一条链路完成资料生产。</p>
        </div>
        <button onClick={() => navigate('/import')}>新建项目</button>
      </section>
      <section className="home-grid">
        <section className="panel home-section">
          <h3>常用资料类型</h3>
          <ul className="quick-types">
            <li>汇报材料</li>
            <li>招商方案</li>
            <li>产品介绍</li>
            <li>长图 / 信息页</li>
          </ul>
        </section>
        <section className="panel home-section">
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
            <p>还没有最近项目，先创建一个资料生产项目。</p>
          )}
        </section>
      </section>
    </main>
  );
}
