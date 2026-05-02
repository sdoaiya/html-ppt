import { Link, Outlet, useLocation } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

const steps = [
  { id: 'import', label: '上传资料' },
  { id: 'type', label: '选择类型' },
  { id: 'understanding', label: '理解资料' },
  { id: 'config', label: '配置方案' },
  { id: 'progress', label: '生成进度' },
  { id: 'workbench', label: '预览微调' },
  { id: 'export', label: '导出成品' }
];

const routeStepMap: Record<string, string> = {
  '/': 'import',
  '/import': 'import',
  '/type': 'type',
  '/understanding': 'understanding',
  '/config': 'config',
  '/progress': 'progress',
  '/workbench': 'workbench',
  '/preview': 'workbench',
  '/export': 'export'
};

export function AppShell() {
  const location = useLocation();
  const project = useProjectStore((state) => state.currentProject);
  const currentStepId = routeStepMap[location.pathname] ?? '';
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  const currentStepLabel = steps.find((s) => s.id === currentStepId)?.label;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <h1><Link to="/">资料生产工作台</Link></h1>
          <p>{project?.name ?? '当前未选择项目'}</p>
        </div>

        {/* Stage Progress */}
        <nav aria-label="主导航" className="sidebar-nav">
          {steps.map((step, index) => {
            const path = step.id === 'import' ? '/import' : `/${step.id}`;
            const isActive = location.pathname === path;
            const isComplete = currentIndex > index;
            return (
              <Link
                key={step.id}
                to={path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: isComplete ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--surface2)',
                    color: isComplete || isActive ? '#fff' : 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {isComplete ? '✓' : index + 1}
                </span>
                {step.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/settings" className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}>
            ⚙ 设置
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="desktop-main">
        <header className="desktop-toolbar">
          <div className="desktop-toolbar-left">
            <strong>{currentStepLabel || '资料生产工作台'}</strong>
            <p>
              {project?.brief ??
                '从资料导入、结构生成到工作台预览与配图生成，一条链路完成资料生产。'}
            </p>
          </div>
          <div className="desktop-toolbar-right">
            <span className="toolbar-badge">SYSTEM ONLINE</span>
            {project && (
              <button
                className="btn btn-surface"
                style={{ fontSize: 12, padding: '6px 14px' }}
                onClick={() => window.desktopBridge?.exportProjectJson?.(project)}
              >
                导出
              </button>
            )}
          </div>
        </header>
        <div className="desktop-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
