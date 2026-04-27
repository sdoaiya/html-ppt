import { Outlet } from 'react-router-dom';

const steps = ['上传资料', '理解资料', '组织结构', '选择方向', '生成版式', '导出成品'];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>资料生产工作台</h1>
        <nav aria-label="生产流程">
          {steps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
