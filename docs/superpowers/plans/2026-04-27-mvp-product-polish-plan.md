# MVP Product Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前资料生产工作台 MVP 从“能跑通的原型”提升为“更像真实产品的可演示版本”，重点完善导航、信息层级、页面状态和预览舞台。

**Architecture:** 继续沿用现有 Electron + React + Zustand 架构，不新增后端能力。改造集中在页面信息结构、UI 组件职责、状态反馈组件化和现有工作台的数据展示方式，保持现有数据流不推翻。预览区、设置页和导出页通过更明确的结构与状态表达提升产品完成度。

**Tech Stack:** Electron, React, TypeScript, Zustand, Vitest, Testing Library, Vite

---

## File Structure

本轮主要修改以下文件：

- Modify: `src/layouts/AppShell.tsx`
  责任：顶部总控条，当前项目名、阶段条、右侧入口

- Modify: `src/styles/globals.css`
  责任：本轮产品观感改造的视觉层级、卡片、状态条、预览舞台样式

- Modify: `src/components/workbench/SourcePanel.tsx`
  责任：资料卡，从说明性面板提升为真实资料列表卡

- Modify: `src/components/workbench/StructurePanel.tsx`
  责任：结构卡，从说明性面板提升为真实结构列表卡

- Modify: `src/components/workbench/PreviewCanvas.tsx`
  责任：预览舞台、封面卡槽、对比页卡槽与生成结果展示

- Modify: `src/features/projects/pages/ImportPage.tsx`
  责任：导入页文案与引导信息层级

- Modify: `src/features/projects/pages/UnderstandingPage.tsx`
  责任：理解页资料来源、系统理解结果与引导提示

- Modify: `src/features/projects/pages/StructurePage.tsx`
  责任：结构页的页面角色和下一步说明

- Modify: `src/features/projects/pages/WorkbenchPage.tsx`
  责任：工作台主视图、状态反馈、图片服务状态、预览舞台联动

- Modify: `src/features/projects/pages/ExportPage.tsx`
  责任：导出页收口、质检提示、导出反馈

- Modify: `src/features/settings/pages/SettingsPage.tsx`
  责任：连接状态卡与配置反馈

- Modify: `src/App.test.tsx`
  责任：顶部导航入口与基础产品壳层验证

- Modify: `src/features/projects/pages/WorkbenchPage.test.tsx`
  责任：工作台内容层级、卡槽与状态反馈验证

---

## Scope Cut

本计划只覆盖“产品观感与信息层级改造”，不包含：

- 新的后端接口
- 图生图上传链路
- 多人协作
- PDF/PPT 真导出增强
- 动画、视频、复杂视觉特效

---

### Task 1: Top Bar Productization

**Files:**
- Modify: `src/layouts/AppShell.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Write the failing navigation shell test**

```tsx
test('shows current project area and settings entry in top bar', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: '设置' })).toBeInTheDocument();
  expect(screen.getByText('资料生产工作台')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails or is incomplete**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL if the shell does not present the required top-bar structure, or PASS but without the target structure once assertion expands.

- [ ] **Step 3: Implement top bar structure**

Add three top-bar regions:

```tsx
// src/layouts/AppShell.tsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

const stageMap: Record<string, string> = {
  '/': '上传资料',
  '/import': '上传资料',
  '/understanding': '理解资料',
  '/structure': '组织结构',
  '/workbench': '生成版式',
  '/export': '导出成品',
  '/settings': '系统设置'
};

const steps = ['上传资料', '理解资料', '组织结构', '生成版式', '导出成品'];

export function AppShell() {
  const location = useLocation();
  const project = useProjectStore((state) => state.currentProject);
  const currentStage = stageMap[location.pathname] ?? '上传资料';

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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/layouts/AppShell.tsx src/App.test.tsx src/styles/globals.css
git commit -m "feat: productize top navigation shell"
```

### Task 2: Import / Understanding / Structure Copy Polish

**Files:**
- Modify: `src/features/projects/pages/ImportPage.tsx`
- Modify: `src/features/projects/pages/UnderstandingPage.tsx`
- Modify: `src/features/projects/pages/StructurePage.tsx`

- [ ] **Step 1: Write failing copy test for understanding page**

```tsx
test('shows imported materials section and next-step guidance', () => {
  render(<UnderstandingPage />);
  expect(screen.getByText('已导入资料')).toBeInTheDocument();
  expect(screen.getByText('这些资料将作为当前内容生成输入')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/projects/pages/UnderstandingPage.test.tsx`
Expected: FAIL because the guidance copy is missing.

- [ ] **Step 3: Implement copy and empty-state polish**

Apply these changes:

```tsx
// ImportPage.tsx
<p className="page-intro">上传文档、表格、截图或旧方案，系统会先理解资料，再生成结构和版式。</p>
```

```tsx
// UnderstandingPage.tsx
<section>
  <h3>已导入资料</h3>
  <p>这些资料将作为当前内容生成输入。</p>
</section>

<section>
  <h3>系统建议</h3>
  <p>以下内容适合转成图表、对比页或流程页。</p>
</section>
```

```tsx
// StructurePage.tsx
<p className="page-intro">当前结构将驱动后续版式与配图生成。</p>
```

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm run test -- src/features/projects/pages/UnderstandingPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/projects/pages/ImportPage.tsx src/features/projects/pages/UnderstandingPage.tsx src/features/projects/pages/StructurePage.tsx
git commit -m "feat: improve project flow instructional copy"
```

### Task 3: Left Rail Data Cards

**Files:**
- Modify: `src/components/workbench/SourcePanel.tsx`
- Modify: `src/components/workbench/StructurePanel.tsx`
- Modify: `src/features/projects/pages/WorkbenchPage.test.tsx`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Write failing workbench left-rail assertions**

```tsx
test('shows source and structure cards with real items', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('资料区')).toBeInTheDocument();
  expect(screen.getByText('结构区')).toBeInTheDocument();
  expect(screen.getByText('封面')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails or is too weak**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: FAIL or reveal that the panels still read as placeholder-only content.

- [ ] **Step 3: Implement real data-card presentation**

The cards should present:

```tsx
// SourcePanel.tsx
<section className="panel source-card">
  <div className="panel-header">
    <h3>资料区</h3>
    <span className="count-badge">{sources.length} 份资料</span>
  </div>
  <p>当前资料将作为本次内容生成输入。</p>
  ...
</section>
```

```tsx
// StructurePanel.tsx
<section className="panel structure-card">
  <h3>结构区</h3>
  <p>当前结构用于驱动版式与配图生成。</p>
  ...
</section>
```

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/workbench/SourcePanel.tsx src/components/workbench/StructurePanel.tsx src/features/projects/pages/WorkbenchPage.test.tsx src/styles/globals.css
git commit -m "feat: turn left rail into data cards"
```

### Task 4: Preview Stage Productization

**Files:**
- Modify: `src/components/workbench/PreviewCanvas.tsx`
- Modify: `src/styles/globals.css`
- Modify: `src/features/projects/pages/WorkbenchPage.test.tsx`

- [ ] **Step 1: Write failing preview slot test**

```tsx
test('shows cover and comparison slots with product-style labels', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('封面卡槽')).toBeInTheDocument();
  expect(screen.getByText('对比页卡槽')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails or is incomplete**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: FAIL or indicate the preview is still too generic.

- [ ] **Step 3: Implement stage-like preview canvas**

Enhance the preview card with:

```tsx
<article className="preview-card">
  <div className="preview-meta">
    <h4>{projectName}</h4>
    <span className="preview-tag">当前结果预览</span>
  </div>
  <section className="preview-slots">
    <div className="preview-slot cover-slot">...</div>
    <div className="preview-slot comparison-slot">...</div>
  </section>
</article>
```

Visual requirements:

- More stage-like spacing
- Clear slot boundaries
- Generated image visibly anchored into a slot, not floating as a generic image

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/workbench/PreviewCanvas.tsx src/styles/globals.css src/features/projects/pages/WorkbenchPage.test.tsx
git commit -m "feat: productize preview stage"
```

### Task 5: Workbench Status Hierarchy

**Files:**
- Modify: `src/features/projects/pages/WorkbenchPage.tsx`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Write failing status feedback test**

```tsx
test('shows image service and version status messages', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText(/图片服务/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails or is weak**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: FAIL or indicate status messages are too flat.

- [ ] **Step 3: Implement grouped status block**

Group status under a dedicated panel region:

```tsx
<section className="status-card">
  <h4>当前状态</h4>
  <p>{imageConfig.apiKey ? '图片服务已连接' : '请先到设置页配置 API Key'}</p>
  {saveMessage ? <p>{saveMessage}</p> : <p>当前版本尚未保存</p>}
</section>
```

Goal:

- Right rail should read as “operation panel + state panel”, not a flat list of controls

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/projects/pages/WorkbenchPage.tsx src/styles/globals.css
git commit -m "feat: group workbench status feedback"
```

### Task 6: Settings Page Status Card Polish

**Files:**
- Modify: `src/features/settings/pages/SettingsPage.tsx`
- Modify: `src/styles/globals.css`
- Modify: `src/features/settings/__tests__/ImageProviderForm.test.tsx`

- [ ] **Step 1: Write failing settings status test**

```tsx
test('shows provider connection status summary', () => {
  render(<SettingsPage />);
  expect(screen.getByText('连接状态')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/settings/__tests__/ImageProviderForm.test.tsx`
Expected: FAIL because the page is tested only for form submit behavior.

- [ ] **Step 3: Implement connection summary layout**

The page should show:

```tsx
<section className="panel status-panel">
  <h3>连接状态</h3>
  <p>Base URL：...</p>
  <p>API Key：已配置 / 未配置</p>
  <p>模型：gpt-image-2</p>
</section>
```

Enhance the visual separation between status card and form.

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm run test -- src/features/settings/__tests__/ImageProviderForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/settings/pages/SettingsPage.tsx src/styles/globals.css src/features/settings/__tests__/ImageProviderForm.test.tsx
git commit -m "feat: polish settings status card"
```

### Task 7: Export Page Productized Feedback

**Files:**
- Modify: `src/features/projects/pages/ExportPage.tsx`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Write failing export page test**

```tsx
test('shows export feedback action and risk summary', () => {
  render(<ExportPage />);
  expect(screen.getByText('导出前质检')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '导出项目 JSON' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails or is incomplete**

Run: `npm run test -- src/features/projects/pages/ExportPage.test.tsx`
Expected: FAIL or reveal that the page is too bare.

- [ ] **Step 3: Implement richer export summary**

Add a compact summary block:

```tsx
<section className="panel export-summary">
  <h3>导出前质检</h3>
  <p>请先处理高风险项，再导出项目结果。</p>
  ...
</section>
```

Goal:

- Make export page feel like a true final-step checkpoint

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm run test -- src/features/projects/pages/ExportPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/projects/pages/ExportPage.tsx src/styles/globals.css src/features/projects/pages/ExportPage.test.tsx
git commit -m "feat: polish export summary page"
```

---

## Spec Coverage Self-Review

Covered spec items:

- 顶部总控条：Task 1
- 左栏资料 / 结构卡片化：Task 3
- 中栏预览舞台化与卡槽明确化：Task 4
- 右栏状态反馈分层：Task 5
- 设置页状态卡强化：Task 6
- 导出页结果收口：Task 7
- 文案从技术说明改成工作台提示语：Task 2, 3, 4, 6, 7

No uncovered requirement remains from the product polish spec.

## Placeholder Scan

No TBD/TODO placeholders in tasks. All tasks specify files, tests, commands, and intended code shape.

## Type Consistency Check

- `Project` variant shape remains aligned with current store usage
- `SourcePanel` uses `SourceAsset[]`
- `StructurePanel` uses `StructureNode[]`
- `PreviewCanvas` remains driven by `generatedImageUrl` and `pageTitles`

---

Plan complete and saved to `docs/superpowers/plans/2026-04-27-mvp-product-polish-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
