import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

const productTypes = [
  {
    id: 'report',
    name: '汇报材料',
    desc: '适合季度复盘、业务进展汇报',
    badge: '12–18 页',
    mode: '图表 + 章节型',
    color: 'accent'
  },
  {
    id: 'pitch',
    name: '招商方案',
    desc: '适合园区推介、产业落地方案',
    badge: '14–22 页',
    mode: '大图 + 数据证据',
    color: 'warning'
  },
  {
    id: 'product',
    name: '产品介绍',
    desc: '适合解决方案、产品卖点表达',
    badge: '8–14 页',
    mode: '卖点 + 场景化',
    color: 'success'
  },
  {
    id: 'infographic',
    name: '长图 / 信息页',
    desc: '适合公众号长图、单页信息展示',
    badge: '1 张长图',
    mode: '连续滚动阅读',
    color: 'violet'
  }
];

const mockStats = [
  { label: '今日生成概览', value: '18 份', meta: '▲ 23% vs 昨日', trend: 'up' },
  { label: '招商方案', value: '6 份', meta: '平均 14 页', trend: null },
  { label: '汇报材料', value: '7 份', meta: '图表命中率 92%', trend: null }
];

const mockRecentProjects = [
  {
    id: '1',
    name: '华东先进制造招商提案',
    stage: '生成配置',
    meta: '待确认 Skill 组合',
    active: false
  },
  {
    id: '2',
    name: 'Q2 战略复盘汇报',
    stage: '预览微调',
    meta: '刚刚更新 · 3 分钟前',
    active: true
  },
  {
    id: '3',
    name: 'Aegis 产品介绍',
    stage: '导出成品',
    meta: 'HTML 与 PDF 已就绪',
    active: false
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const recentProjects = useProjectStore((state) => state.recentProjects);
  const setStage = useProjectStore((state) => state.setStage);

  const handleTypeSelect = (typeId: string) => {
    setStage('import');
    navigate('/type');
  };

  const handleRecentClick = (project: (typeof mockRecentProjects)[0]) => {
    const routeMap: Record<string, string> = {
      生成配置: '/type',
      预览微调: '/workbench',
      导出成品: '/export'
    };
    navigate(routeMap[project.stage] ?? '/workbench');
  };

  const displayProjects = recentProjects.length > 0 ? recentProjects.map((p) => ({
    id: p.id,
    name: p.name,
    stage: p.stage,
    meta: p.brief,
    active: false
  })) : mockRecentProjects;

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-hero">
        <p className="home-hero-sub">WORKFLOW READY</p>
        <h2>把资料变成可交付成品，整个过程都看得见。</h2>
        <p>从上传原始资料、理解主题、自动组合 Skill，到生成成品预览与自然语言微调，整个链路都收进同一个专业工作台里。</p>
        <div className="home-hero-actions">
          <button className="btn-primary" onClick={() => navigate('/import')}>新建项目</button>
          <button className="btn-ghost" onClick={() => navigate('/workbench')}>继续最近项目</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="home-stats-row">
        {mockStats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
            {s.meta && <div className="stat-card-meta">{s.meta}</div>}
          </div>
        ))}
      </div>

      {/* Product Types */}
      <section>
        <div className="home-section-title">常用成品类型</div>
        <div className="home-product-grid">
          {productTypes.map((type) => (
            <button
              key={type.id}
              className="product-type-card"
              onClick={() => handleTypeSelect(type.id)}
            >
              <div className="product-type-card-name">{type.name}</div>
              <div className="product-type-card-desc">{type.desc}</div>
              <span className="product-type-card-badge">{type.badge} · {type.mode}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section>
        <div className="home-section-title">最近项目</div>
        <div className="recent-projects-grid">
          {displayProjects.length === 0 ? (
            <p className="text-muted" style={{ padding: '12px 0' }}>还没有最近项目，先新建一个。</p>
          ) : (
            displayProjects.map((project) => (
              <div
                key={project.id}
                className={`recent-project-card ${project.active ? 'active-recent' : ''}`}
                onClick={() => handleRecentClick(project as (typeof mockRecentProjects)[0])}
              >
                <div>
                  <div className="recent-project-name">{project.name}</div>
                  <div className="recent-project-meta">{project.meta}</div>
                </div>
                <span className={`recent-project-stage ${project.active ? 'active-stage' : ''}`}>
                  {project.stage}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
