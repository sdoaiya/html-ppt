import { Link, Outlet, useLocation } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

const steps = ['上传资料', '理解资料', '组织结构', '生成版式', '导出成品'];

const routeStageMap: Record<string, string> = {
  '/': '上传资料',
  '/import': '上传资料',
  '/understanding': '理解资料',
  '/structure': '组织结构',
  '/workbench': '生成版式',
  '/export': '导出成品'
};

export function AppShell() {
  const location = useLocation();
  const project = useProjectStore((state) => state.currentProject);
  const currentStage = routeStageMap[location.pathname] ?? '';

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <h1>资料生产工作台</h1>
          <p>{project?.name ?? '当前未选择项目'}</p>
        </div>
        <nav aria-label="生产流程" className="stage-nav">
          {steps.map((step) => (
            <span key={step} className={step === currentStage ? 'stage-chip active' : 'stage-chip'}>{step}</span>
          ))}
        </nav>
        <div className="topbar-actions">
          <Link to="/settings">设置</Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
