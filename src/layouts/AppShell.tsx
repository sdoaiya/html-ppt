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
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <h1><Link to="/">资料生产工作台</Link></h1>
          <p>{project?.name ?? '当前未选择项目'}</p>
        </div>

        <nav aria-label="主导航" className="sidebar-nav">
          <Link to="/import" className={location.pathname === '/import' || location.pathname === '/' ? 'sidebar-link active' : 'sidebar-link'}>上传资料</Link>
          <Link to="/understanding" className={location.pathname === '/understanding' ? 'sidebar-link active' : 'sidebar-link'}>理解资料</Link>
          <Link to="/structure" className={location.pathname === '/structure' ? 'sidebar-link active' : 'sidebar-link'}>组织结构</Link>
          <Link to="/workbench" className={location.pathname === '/workbench' ? 'sidebar-link active' : 'sidebar-link'}>生成版式</Link>
          <Link to="/export" className={location.pathname === '/export' ? 'sidebar-link active' : 'sidebar-link'}>导出成品</Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/settings" className={location.pathname === '/settings' ? 'sidebar-link active' : 'sidebar-link'}>设置</Link>
        </div>
      </aside>

      <div className="desktop-main">
        <header className="desktop-toolbar">
          <div>
            <strong>{currentStage || '资料生产工作台'}</strong>
            <p>{project?.brief ?? '从资料导入、结构生成到工作台预览与配图生成，一条链路完成资料生产。'}</p>
          </div>
        </header>
        <div className="desktop-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
