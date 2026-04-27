# 资料生产工作台（Electron 版）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一套 Electron 桌面端资料生产工作台 MVP，让管理者和业务人员可以导入资料、生成结构、在工作台中预览与微调，并通过可配置的 `gpt-image-2` 图像能力提升图片产出可控性。

**Architecture:** 采用 Electron + Vite + React + TypeScript 的桌面应用架构。主进程负责文件系统、配置存储与本地导出，渲染进程负责工作台 UI、项目状态与能力调用编排；AI 能力通过 renderer 的 service 层统一封装，其中图像能力抽象为可配置的 OpenAI-compatible provider，支持自定义 `base_url`、`api_key`、`gpt-image-2` 文生图/图生图接口。

**Tech Stack:** Electron, Vite, React, TypeScript, Vitest, Testing Library, Playwright, Zustand, Zod, Electron Store, TanStack Query, Node fs/path, OpenAI-compatible HTTP API

---

## 0. File Structure

在动手前，先固定文件结构，避免后续把工作台、解析、AI 能力、配置全揉在一起。

### Root

- Create: `package.json` — workspace scripts、依赖、打包脚本
- Create: `tsconfig.json` — TypeScript 根配置
- Create: `vite.config.ts` — 渲染进程构建
- Create: `vitest.config.ts` — 单元测试配置
- Create: `playwright.config.ts` — E2E/桌面 smoke 测试
- Create: `index.html` — Vite 入口 HTML
- Create: `.gitignore`
- Create: `docs/architecture/project-structure.md` — 项目结构说明

### Electron Main / Preload

- Create: `electron/main.ts` — 创建窗口、注册 IPC、应用生命周期
- Create: `electron/preload.ts` — 暴露安全 bridge API
- Create: `electron/ipc/app-config.ts` — 读取/保存应用配置
- Create: `electron/ipc/project-files.ts` — 资料导入、项目文件保存/读取
- Create: `electron/ipc/export.ts` — 导出项目/页面快照
- Create: `electron/services/store.ts` — Electron Store 封装

### Renderer App Shell

- Create: `src/main.tsx` — React 渲染入口
- Create: `src/App.tsx` — 路由与全局 providers
- Create: `src/styles/globals.css` — 全局样式
- Create: `src/routes/router.tsx` — 页面路由
- Create: `src/layouts/AppShell.tsx` — 顶部流程 + 三栏布局壳

### Domain / State

- Create: `src/domain/projects/types.ts` — Project、SourceAsset、StructureNode、DraftVariant 等类型
- Create: `src/domain/projects/schemas.ts` — Zod schema
- Create: `src/domain/projects/factories.ts` — 默认对象工厂
- Create: `src/stores/project-store.ts` — 当前项目状态
- Create: `src/stores/settings-store.ts` — 本地 UI/偏好状态

### Features

- Create: `src/features/projects/pages/HomePage.tsx`
- Create: `src/features/projects/pages/ImportPage.tsx`
- Create: `src/features/projects/pages/UnderstandingPage.tsx`
- Create: `src/features/projects/pages/StructurePage.tsx`
- Create: `src/features/projects/pages/WorkbenchPage.tsx`
- Create: `src/features/projects/pages/ExportPage.tsx`
- Create: `src/features/settings/pages/SettingsPage.tsx`

### Components

- Create: `src/components/workbench/StageProgress.tsx`
- Create: `src/components/workbench/SourcePanel.tsx`
- Create: `src/components/workbench/StructurePanel.tsx`
- Create: `src/components/workbench/PreviewCanvas.tsx`
- Create: `src/components/workbench/ActionPanel.tsx`
- Create: `src/components/workbench/VariantSwitcher.tsx`
- Create: `src/components/settings/ImageProviderForm.tsx`

### Services

- Create: `src/services/files/import-service.ts` — 文件导入与 metadata 提取
- Create: `src/services/understanding/understanding-service.ts` — 资料理解结果生成（先 mock/规则化）
- Create: `src/services/structure/structure-service.ts` — 自动结构生成
- Create: `src/services/drafts/draft-service.ts` — 版式 draft/variant 生成
- Create: `src/services/quality/quality-service.ts` — 导出前质检
- Create: `src/services/ai/client.ts` — OpenAI-compatible HTTP client
- Create: `src/services/ai/image-provider.ts` — `gpt-image-2` 文生图/图生图封装
- Create: `src/services/ai/prompt-builder.ts` — 图片 prompt 组装

### Tests

- Create: `src/domain/projects/__tests__/schemas.test.ts`
- Create: `src/services/understanding/__tests__/understanding-service.test.ts`
- Create: `src/services/structure/__tests__/structure-service.test.ts`
- Create: `src/services/ai/__tests__/image-provider.test.ts`
- Create: `src/stores/__tests__/project-store.test.ts`
- Create: `src/features/settings/__tests__/ImageProviderForm.test.tsx`
- Create: `e2e/workbench-smoke.spec.ts`

---

## 1. Scope Cut for MVP

这个 spec 覆盖面较大，实施时必须缩成一个能跑通的 MVP。第一版只交付以下闭环：

1. 新建项目
2. 导入资料（文件 metadata + 文本描述）
3. 生成资料理解结果（规则/mock + 可替换）
4. 生成结构树与页面角色
5. 在工作台中查看两个 draft variants
6. 配置并调用 `gpt-image-2` 生成/编辑图片
7. 导出项目 JSON + 页面快照

不在本次实施范围：

- 多人协作
- 真实 PPT 导出
- OCR/复杂文件内容解析
- 大模型全自动结构重写
- 复杂拖拽编辑器

---

## 2. Task List

### Task 1: Scaffold Electron + Vite + React + TypeScript workspace

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/globals.css`

- [ ] **Step 1: Write the failing smoke test for renderer bootstrap**

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application title', () => {
  render(<App />);
  expect(screen.getByText('资料生产工作台')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL with `Cannot find module './App'` or missing file errors.

- [ ] **Step 3: Create minimal project scaffold and app component**

```json
// package.json
{
  "name": "ziliao-workbench",
  "version": "0.1.0",
  "private": true,
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "concurrently \"vite\" \"wait-on tcp:5173 && electron .\"",
    "build": "vite build && tsc -p electron/tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.3",
    "zod": "^3.24.1",
    "@tanstack/react-query": "^5.66.0",
    "electron-store": "^10.0.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/node": "^22.13.10",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.4.1",
    "concurrently": "^9.1.2",
    "electron": "^35.1.5",
    "typescript": "^5.7.3",
    "vite": "^6.2.0",
    "vitest": "^3.0.5",
    "wait-on": "^8.0.2"
  }
}
```

```tsx
// src/App.tsx
export default function App() {
  return (
    <main>
      <h1>资料生产工作台</h1>
      <p>让不懂设计的人，也能把杂乱资料快速做成高质量业务资料。</p>
    </main>
  );
}
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts vitest.config.ts playwright.config.ts index.html src/main.tsx src/App.tsx src/styles/globals.css src/App.test.tsx .gitignore
git commit -m "chore: scaffold electron renderer app"
```

### Task 2: Add Electron main process and secure preload bridge

**Files:**
- Create: `electron/tsconfig.json`
- Create: `electron/main.ts`
- Create: `electron/preload.ts`
- Create: `src/types/electron.d.ts`
- Test: `e2e/workbench-smoke.spec.ts`

- [ ] **Step 1: Write the failing E2E smoke spec**

```ts
// e2e/workbench-smoke.spec.ts
import { test, expect } from '@playwright/test';

test('shows app title in desktop shell', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  await expect(page.getByRole('heading', { name: '资料生产工作台' })).toBeVisible();
});
```

- [ ] **Step 2: Run E2E to verify setup is incomplete**

Run: `npm run e2e -- e2e/workbench-smoke.spec.ts`
Expected: FAIL because Electron shell/bootstrap is not configured yet.

- [ ] **Step 3: Implement Electron bootstrap and preload API**

```ts
// electron/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'node:path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1280,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

```ts
// electron/preload.ts
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  version: '0.1.0'
});
```

```ts
// src/types/electron.d.ts
declare global {
  interface Window {
    desktopBridge: {
      platform: string;
      version: string;
    };
  }
}

export {};
```

- [ ] **Step 4: Run smoke spec to verify it passes**

Run: `npm run e2e -- e2e/workbench-smoke.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/tsconfig.json electron/main.ts electron/preload.ts src/types/electron.d.ts e2e/workbench-smoke.spec.ts
git commit -m "feat: add electron shell bootstrap"
```

### Task 3: Define domain models and schema validation

**Files:**
- Create: `src/domain/projects/types.ts`
- Create: `src/domain/projects/schemas.ts`
- Create: `src/domain/projects/factories.ts`
- Test: `src/domain/projects/__tests__/schemas.test.ts`

- [ ] **Step 1: Write failing schema tests**

```ts
// src/domain/projects/__tests__/schemas.test.ts
import { describe, expect, it } from 'vitest';
import { projectSchema } from '../schemas';

describe('projectSchema', () => {
  it('accepts a minimal project', () => {
    const result = projectSchema.safeParse({
      id: 'p1',
      name: '招商资料',
      stage: 'import',
      brief: '整理成招商汇报',
      sources: [],
      understanding: null,
      structure: [],
      variants: []
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid stage values', () => {
    const result = projectSchema.safeParse({ id: 'p1', name: 'x', stage: 'done' });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/domain/projects/__tests__/schemas.test.ts`
Expected: FAIL with missing schema exports.

- [ ] **Step 3: Implement domain types and zod schemas**

```ts
// src/domain/projects/types.ts
export type ProjectStage =
  | 'import'
  | 'understanding'
  | 'structure'
  | 'direction'
  | 'workbench'
  | 'export';

export type SourceAsset = {
  id: string;
  name: string;
  kind: 'document' | 'spreadsheet' | 'image' | 'audio' | 'archive';
  path: string;
  status: 'ready' | 'parsing' | 'conflict' | 'low_quality';
};

export type StructureNode = {
  id: string;
  title: string;
  role:
    | 'cover'
    | 'conclusion'
    | 'background'
    | 'comparison'
    | 'process'
    | 'data'
    | 'proof'
    | 'closing';
  bullets: string[];
};
```

```ts
// src/domain/projects/schemas.ts
import { z } from 'zod';

export const projectStageSchema = z.enum([
  'import',
  'understanding',
  'structure',
  'direction',
  'workbench',
  'export'
]);

export const sourceAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['document', 'spreadsheet', 'image', 'audio', 'archive']),
  path: z.string(),
  status: z.enum(['ready', 'parsing', 'conflict', 'low_quality'])
});

export const structureNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  role: z.enum(['cover', 'conclusion', 'background', 'comparison', 'process', 'data', 'proof', 'closing']),
  bullets: z.array(z.string())
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  stage: projectStageSchema,
  brief: z.string(),
  sources: z.array(sourceAssetSchema),
  understanding: z.any().nullable(),
  structure: z.array(structureNodeSchema),
  variants: z.array(z.any())
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/domain/projects/__tests__/schemas.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/projects/types.ts src/domain/projects/schemas.ts src/domain/projects/factories.ts src/domain/projects/__tests__/schemas.test.ts
git commit -m "feat: define project domain schemas"
```

### Task 4: Build persisted project store and app settings store

**Files:**
- Create: `src/stores/project-store.ts`
- Create: `src/stores/settings-store.ts`
- Test: `src/stores/__tests__/project-store.test.ts`

- [ ] **Step 1: Write failing store tests**

```ts
// src/stores/__tests__/project-store.test.ts
import { describe, expect, it } from 'vitest';
import { useProjectStore } from '../project-store';

describe('project store', () => {
  it('creates a new project with brief', () => {
    useProjectStore.getState().createProject('招商资料', '做成招商汇报');
    expect(useProjectStore.getState().currentProject?.name).toBe('招商资料');
  });

  it('moves project to next stage', () => {
    useProjectStore.getState().setStage('structure');
    expect(useProjectStore.getState().currentProject?.stage).toBe('structure');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/stores/__tests__/project-store.test.ts`
Expected: FAIL with missing store exports.

- [ ] **Step 3: Implement Zustand stores**

```ts
// src/stores/project-store.ts
import { create } from 'zustand';
import { createEmptyProject } from '@/domain/projects/factories';
import type { ProjectStage } from '@/domain/projects/types';

type ProjectStore = {
  currentProject: ReturnType<typeof createEmptyProject> | null;
  createProject: (name: string, brief: string) => void;
  setStage: (stage: ProjectStage) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  createProject: (name, brief) => set({ currentProject: createEmptyProject(name, brief) }),
  setStage: (stage) =>
    set((state) => ({
      currentProject: state.currentProject ? { ...state.currentProject, stage } : null
    }))
}));
```

```ts
// src/stores/settings-store.ts
import { create } from 'zustand';

type SettingsStore = {
  denseMode: boolean;
  setDenseMode: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  denseMode: false,
  setDenseMode: (value) => set({ denseMode: value })
}));
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/stores/__tests__/project-store.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/stores/project-store.ts src/stores/settings-store.ts src/stores/__tests__/project-store.test.ts
git commit -m "feat: add project and settings stores"
```

### Task 5: Implement project home and route skeleton

**Files:**
- Create: `src/routes/router.tsx`
- Create: `src/layouts/AppShell.tsx`
- Create: `src/features/projects/pages/HomePage.tsx`
- Create: `src/features/projects/pages/ImportPage.tsx`
- Create: `src/features/projects/pages/UnderstandingPage.tsx`
- Create: `src/features/projects/pages/StructurePage.tsx`
- Create: `src/features/projects/pages/WorkbenchPage.tsx`
- Create: `src/features/projects/pages/ExportPage.tsx`

- [ ] **Step 1: Write failing route test**

```tsx
import { render, screen } from '@testing-library/react';
import App from '@/App';

test('renders new project entry action', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: '新建项目' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL because route shell has not been implemented.

- [ ] **Step 3: Build route skeleton and app shell**

```tsx
// src/layouts/AppShell.tsx
import { Outlet } from 'react-router-dom';

const steps = ['上传资料', '理解资料', '组织结构', '选择方向', '生成版式', '导出成品'];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>资料生产工作台</h1>
        <nav>{steps.map((step) => <span key={step}>{step}</span>)}</nav>
      </header>
      <Outlet />
    </div>
  );
}
```

```tsx
// src/features/projects/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section>
      <button onClick={() => navigate('/import')}>新建项目</button>
      <ul>
        <li>汇报材料</li>
        <li>招商方案</li>
        <li>产品介绍</li>
        <li>长图 / 信息页</li>
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/router.tsx src/layouts/AppShell.tsx src/features/projects/pages/HomePage.tsx src/features/projects/pages/ImportPage.tsx src/features/projects/pages/UnderstandingPage.tsx src/features/projects/pages/StructurePage.tsx src/features/projects/pages/WorkbenchPage.tsx src/features/projects/pages/ExportPage.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: add route skeleton and app shell"
```

### Task 6: Add desktop settings persistence and configurable image provider config

**Files:**
- Create: `electron/services/store.ts`
- Create: `electron/ipc/app-config.ts`
- Modify: `electron/main.ts`
- Modify: `electron/preload.ts`
- Create: `src/features/settings/pages/SettingsPage.tsx`
- Create: `src/components/settings/ImageProviderForm.tsx`
- Test: `src/features/settings/__tests__/ImageProviderForm.test.tsx`

- [ ] **Step 1: Write failing settings form test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageProviderForm } from '../ImageProviderForm';

test('submits custom base url and api key', async () => {
  const onSave = vi.fn();
  render(<ImageProviderForm initial={{ baseUrl: '', apiKey: '', model: 'gpt-image-2' }} onSave={onSave} />);

  await userEvent.type(screen.getByLabelText('Base URL'), 'https://free.codesonline.dev/v1');
  await userEvent.type(screen.getByLabelText('API Key'), 'sk-test');
  await userEvent.click(screen.getByRole('button', { name: '保存配置' }));

  expect(onSave).toHaveBeenCalledWith({
    baseUrl: 'https://free.codesonline.dev/v1',
    apiKey: 'sk-test',
    model: 'gpt-image-2',
    responseFormat: 'url'
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/settings/__tests__/ImageProviderForm.test.tsx`
Expected: FAIL with missing component.

- [ ] **Step 3: Implement settings storage and image provider form**

```ts
// electron/ipc/app-config.ts
import { ipcMain } from 'electron';
import { appStore } from '../services/store';

export type ImageProviderConfig = {
  baseUrl: string;
  apiKey: string;
  model: 'gpt-image-2';
  responseFormat: 'url';
};

ipcMain.handle('config:get-image-provider', () => appStore.get('imageProvider'));
ipcMain.handle('config:set-image-provider', (_, payload: ImageProviderConfig) => {
  appStore.set('imageProvider', payload);
  return payload;
});
```

```tsx
// src/components/settings/ImageProviderForm.tsx
type Props = {
  initial: {
    baseUrl: string;
    apiKey: string;
    model: 'gpt-image-2';
  };
  onSave: (value: {
    baseUrl: string;
    apiKey: string;
    model: 'gpt-image-2';
    responseFormat: 'url';
  }) => void;
};

export function ImageProviderForm({ initial, onSave }: Props) {
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
  const [apiKey, setApiKey] = useState(initial.apiKey);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ baseUrl, apiKey, model: 'gpt-image-2', responseFormat: 'url' });
      }}
    >
      <label>
        Base URL
        <input aria-label="Base URL" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
      </label>
      <label>
        API Key
        <input aria-label="API Key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </label>
      <button type="submit">保存配置</button>
    </form>
  );
}
```

Configuration default:

```ts
{
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/settings/__tests__/ImageProviderForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/services/store.ts electron/ipc/app-config.ts electron/main.ts electron/preload.ts src/features/settings/pages/SettingsPage.tsx src/components/settings/ImageProviderForm.tsx src/features/settings/__tests__/ImageProviderForm.test.tsx
git commit -m "feat: add configurable gpt-image-2 settings"
```

### Task 7: Implement source import pipeline and import page

**Files:**
- Create: `electron/ipc/project-files.ts`
- Modify: `electron/preload.ts`
- Create: `src/services/files/import-service.ts`
- Modify: `src/features/projects/pages/ImportPage.tsx`

- [ ] **Step 1: Write failing import service test**

```ts
import { describe, expect, it } from 'vitest';
import { classifyImportedFile } from '../import-service';

describe('classifyImportedFile', () => {
  it('classifies pptx as document-like asset', () => {
    expect(classifyImportedFile('招商方案.pptx')).toBe('document');
  });

  it('classifies png as image asset', () => {
    expect(classifyImportedFile('cover.png')).toBe('image');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/files/import-service.ts`
Expected: FAIL because import service is not implemented.

- [ ] **Step 3: Implement file import utilities and import page wiring**

```ts
// src/services/files/import-service.ts
export function classifyImportedFile(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext ?? '')) return 'image';
  if (['xlsx', 'csv'].includes(ext ?? '')) return 'spreadsheet';
  if (['mp3', 'wav', 'm4a'].includes(ext ?? '')) return 'audio';
  return 'document';
}
```

```tsx
// src/features/projects/pages/ImportPage.tsx
export default function ImportPage() {
  const createProject = useProjectStore((s) => s.createProject);
  const navigate = useNavigate();

  return (
    <section>
      <h2>上传资料</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProject('未命名资料项目', '整理成业务资料');
          navigate('/understanding');
        }}
      >
        <textarea aria-label="目标说明" defaultValue="整理成更高级的业务资料" />
        <button type="submit">开始解析资料</button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/files/__tests__/import-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/ipc/project-files.ts electron/preload.ts src/services/files/import-service.ts src/services/files/__tests__/import-service.test.ts src/features/projects/pages/ImportPage.tsx
git commit -m "feat: add source import pipeline"
```

### Task 8: Implement understanding service and understanding page

**Files:**
- Create: `src/services/understanding/understanding-service.ts`
- Modify: `src/features/projects/pages/UnderstandingPage.tsx`
- Test: `src/services/understanding/__tests__/understanding-service.test.ts`

- [ ] **Step 1: Write failing understanding tests**

```ts
import { describe, expect, it } from 'vitest';
import { buildUnderstanding } from '../understanding-service';

describe('buildUnderstanding', () => {
  it('extracts summary, key points, and open questions', () => {
    const result = buildUnderstanding({
      brief: '做成招商汇报',
      sources: [
        { id: '1', name: '介绍文档.docx', kind: 'document', path: 'x', status: 'ready' }
      ]
    });

    expect(result.summary).toContain('招商汇报');
    expect(result.keyPoints.length).toBeGreaterThan(0);
    expect(Array.isArray(result.openQuestions)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/understanding/__tests__/understanding-service.test.ts`
Expected: FAIL with missing service.

- [ ] **Step 3: Implement rule-based understanding service**

```ts
// src/services/understanding/understanding-service.ts
export function buildUnderstanding(input: { brief: string; sources: Array<{ name: string; kind: string }> }) {
  return {
    summary: `已根据“${input.brief}”整理上传资料，建议先形成招商汇报结构。`,
    keyPoints: input.sources.map((source) => `${source.name} 可作为 ${source.kind} 类输入继续拆解`),
    duplicates: [],
    openQuestions: ['是否需要优先面向领导汇报还是对外招商？'],
    visualizable: ['适合转成对比页的优势信息', '适合转成流程页的实施步骤']
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/understanding/__tests__/understanding-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/understanding/understanding-service.ts src/services/understanding/__tests__/understanding-service.test.ts src/features/projects/pages/UnderstandingPage.tsx
git commit -m "feat: add understanding stage"
```

### Task 9: Implement structure generation service and structure page

**Files:**
- Create: `src/services/structure/structure-service.ts`
- Modify: `src/features/projects/pages/StructurePage.tsx`
- Test: `src/services/structure/__tests__/structure-service.test.ts`

- [ ] **Step 1: Write failing structure tests**

```ts
import { describe, expect, it } from 'vitest';
import { buildStructure } from '../structure-service';

describe('buildStructure', () => {
  it('returns default pages for business deck flow', () => {
    const pages = buildStructure('更适合招商/销售介绍');
    expect(pages[0].role).toBe('cover');
    expect(pages.some((page) => page.role === 'comparison')).toBe(true);
    expect(pages.some((page) => page.role === 'closing')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/structure/__tests__/structure-service.test.ts`
Expected: FAIL because service is missing.

- [ ] **Step 3: Implement structure generator**

```ts
// src/services/structure/structure-service.ts
export function buildStructure(direction: string) {
  return [
    { id: 's1', title: '封面', role: 'cover', bullets: [direction] },
    { id: 's2', title: '核心结论', role: 'conclusion', bullets: ['先讲结果与价值'] },
    { id: 's3', title: '背景问题', role: 'background', bullets: ['为什么现在要做'] },
    { id: 's4', title: '方案对比', role: 'comparison', bullets: ['当前方式 vs 新方式'] },
    { id: 's5', title: '实施流程', role: 'process', bullets: ['执行步骤与节奏'] },
    { id: 's6', title: '收尾行动', role: 'closing', bullets: ['下一步建议'] }
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/structure/__tests__/structure-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/structure/structure-service.ts src/services/structure/__tests__/structure-service.test.ts src/features/projects/pages/StructurePage.tsx
git commit -m "feat: add structure generation stage"
```

### Task 10: Build workbench layout components and project stage navigation

**Files:**
- Create: `src/components/workbench/StageProgress.tsx`
- Create: `src/components/workbench/SourcePanel.tsx`
- Create: `src/components/workbench/StructurePanel.tsx`
- Create: `src/components/workbench/PreviewCanvas.tsx`
- Create: `src/components/workbench/ActionPanel.tsx`
- Create: `src/components/workbench/VariantSwitcher.tsx`
- Modify: `src/features/projects/pages/WorkbenchPage.tsx`

- [ ] **Step 1: Write failing workbench render test**

```tsx
import { render, screen } from '@testing-library/react';
import WorkbenchPage from '../pages/WorkbenchPage';

test('renders three-pane workbench', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('资料区')).toBeInTheDocument();
  expect(screen.getByText('预览区')).toBeInTheDocument();
  expect(screen.getByText('能力区')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: FAIL because the page does not render the workbench layout.

- [ ] **Step 3: Implement the three-pane workbench**

```tsx
// src/features/projects/pages/WorkbenchPage.tsx
import { SourcePanel } from '@/components/workbench/SourcePanel';
import { PreviewCanvas } from '@/components/workbench/PreviewCanvas';
import { ActionPanel } from '@/components/workbench/ActionPanel';

export default function WorkbenchPage() {
  return (
    <section className="workbench-grid">
      <aside><SourcePanel title="资料区" /></aside>
      <main><PreviewCanvas title="预览区" /></main>
      <aside><ActionPanel title="能力区" /></aside>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/workbench/StageProgress.tsx src/components/workbench/SourcePanel.tsx src/components/workbench/StructurePanel.tsx src/components/workbench/PreviewCanvas.tsx src/components/workbench/ActionPanel.tsx src/components/workbench/VariantSwitcher.tsx src/features/projects/pages/WorkbenchPage.tsx src/features/projects/pages/WorkbenchPage.test.tsx
git commit -m "feat: add workbench layout"
```

### Task 11: Add draft variant service and compare mode

**Files:**
- Create: `src/services/drafts/draft-service.ts`
- Modify: `src/features/projects/pages/WorkbenchPage.tsx`
- Modify: `src/components/workbench/VariantSwitcher.tsx`

- [ ] **Step 1: Write failing draft variant test**

```ts
import { describe, expect, it } from 'vitest';
import { buildDraftVariants } from '../draft-service';

describe('buildDraftVariants', () => {
  it('returns stable and expressive variants', () => {
    const variants = buildDraftVariants(['封面', '方案对比']);
    expect(variants.map((item) => item.id)).toEqual(['stable', 'expressive']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/drafts/__tests__/draft-service.test.ts`
Expected: FAIL because the service is missing.

- [ ] **Step 3: Implement draft variant builder**

```ts
// src/services/drafts/draft-service.ts
export function buildDraftVariants(pageTitles: string[]) {
  return [
    {
      id: 'stable',
      label: '稳妥版',
      pages: pageTitles.map((title) => ({ title, tone: 'clear', density: 'medium' }))
    },
    {
      id: 'expressive',
      label: '强表达版',
      pages: pageTitles.map((title) => ({ title, tone: 'bold', density: 'high' }))
    }
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/drafts/__tests__/draft-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/drafts/draft-service.ts src/services/drafts/__tests__/draft-service.test.ts src/features/projects/pages/WorkbenchPage.tsx src/components/workbench/VariantSwitcher.tsx
git commit -m "feat: add draft variant compare mode"
```

### Task 12: Implement OpenAI-compatible HTTP client for image generation

**Files:**
- Create: `src/services/ai/client.ts`
- Create: `src/services/ai/image-provider.ts`
- Create: `src/services/ai/prompt-builder.ts`
- Test: `src/services/ai/__tests__/image-provider.test.ts`

- [ ] **Step 1: Write failing image provider tests**

```ts
import { describe, expect, it, vi } from 'vitest';
import { createImageProvider } from '../image-provider';

describe('image provider', () => {
  it('calls generations endpoint with custom base url', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ url: 'https://img.test/result.png' }] })
    });

    const provider = createImageProvider(fetcher, {
      baseUrl: 'https://free.codesonline.dev/v1',
      apiKey: 'sk-demo',
      model: 'gpt-image-2',
      responseFormat: 'url'
    });

    await provider.generate({ prompt: '一张干净的产品海报', size: '2048x1152', n: 1 });

    expect(fetcher).toHaveBeenCalledWith(
      'https://free.codesonline.dev/v1/images/generations',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/ai/__tests__/image-provider.test.ts`
Expected: FAIL because the provider is missing.

- [ ] **Step 3: Implement OpenAI-compatible image provider**

```ts
// src/services/ai/image-provider.ts
type ImageConfig = {
  baseUrl: string;
  apiKey: string;
  model: 'gpt-image-2';
  responseFormat: 'url';
};

export function createImageProvider(fetcher: typeof fetch, config: ImageConfig) {
  const postJson = async (path: string, body: Record<string, unknown>) => {
    const response = await fetcher(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({ model: config.model, response_format: config.responseFormat, ...body })
    });

    if (!response.ok) throw new Error(`Image request failed: ${response.status}`);
    return response.json();
  };

  return {
    async generate(input: { prompt: string; size: string; n?: number; upscale?: '2k' | '4k' }) {
      return postJson('/images/generations', input);
    },
    async edit(input: {
      prompt: string;
      size: string;
      files: File[];
      upscale?: '2k' | '4k';
    }) {
      const form = new FormData();
      form.append('model', config.model);
      form.append('prompt', input.prompt);
      form.append('size', input.size);
      if (input.upscale) form.append('upscale', input.upscale);

      input.files.forEach((file, index) => {
        form.append(index === 0 ? 'image' : 'image[]', file);
      });

      const response = await fetcher(`${config.baseUrl}/images/edits`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.apiKey}` },
        body: form
      });

      if (!response.ok) throw new Error(`Image edit failed: ${response.status}`);
      return response.json();
    }
  };
}
```

Important implementation rules:

- `baseUrl` 默认为 `https://free.codesonline.dev/v1`
- model 固定 `gpt-image-2`
- generations 用 `POST /images/generations`
- edits 用 `POST /images/edits`
- 默认返回 `url`
- `size` 必须显式传，不只写在 prompt 里

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/ai/__tests__/image-provider.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/ai/client.ts src/services/ai/image-provider.ts src/services/ai/prompt-builder.ts src/services/ai/__tests__/image-provider.test.ts
git commit -m "feat: add configurable gpt-image-2 image provider"
```

### Task 13: Add controllable image generation panel to workbench

**Files:**
- Modify: `src/components/workbench/ActionPanel.tsx`
- Create: `src/components/workbench/ImageGenerationCard.tsx`
- Modify: `src/features/projects/pages/WorkbenchPage.tsx`

- [ ] **Step 1: Write failing panel test**

```tsx
import { render, screen } from '@testing-library/react';
import { ActionPanel } from '../ActionPanel';

test('shows image generation controls', () => {
  render(<ActionPanel title="能力区" />);
  expect(screen.getByText('图片生成')).toBeInTheDocument();
  expect(screen.getByLabelText('输出尺寸')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/workbench/ActionPanel.test.tsx`
Expected: FAIL because image controls are not rendered.

- [ ] **Step 3: Implement image generation card with controllable fields**

```tsx
// src/components/workbench/ImageGenerationCard.tsx
export function ImageGenerationCard() {
  return (
    <section>
      <h3>图片生成</h3>
      <label>
        生成模式
        <select defaultValue="generate">
          <option value="generate">文生图</option>
          <option value="edit">图生图</option>
        </select>
      </label>
      <label>
        输出尺寸
        <select aria-label="输出尺寸" defaultValue="16:9">
          <option value="16:9">16:9</option>
          <option value="1:1">1:1</option>
          <option value="9:16">9:16</option>
          <option value="2048x1152">2048x1152</option>
        </select>
      </label>
      <label>
        高清放大
        <select defaultValue="">
          <option value="">原始尺寸</option>
          <option value="2k">2K</option>
          <option value="4k">4K</option>
        </select>
      </label>
      <textarea aria-label="图片提示词" placeholder="描述你想生成的图像" />
      <button type="button">生成图片</button>
    </section>
  );
}
```

UI requirements:

- 用户必须能选 `size`
- 用户必须能切换文生图/图生图
- 用户必须知道 `upscale` 是本地放大，不是重新绘制
- 设置区展示当前 provider base URL 来源

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/components/workbench/ActionPanel.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/workbench/ActionPanel.tsx src/components/workbench/ImageGenerationCard.tsx src/components/workbench/ActionPanel.test.tsx src/features/projects/pages/WorkbenchPage.tsx
git commit -m "feat: add controllable image generation panel"
```

### Task 14: Add export stage and quality checks

**Files:**
- Create: `electron/ipc/export.ts`
- Create: `src/services/quality/quality-service.ts`
- Modify: `src/features/projects/pages/ExportPage.tsx`

- [ ] **Step 1: Write failing quality service tests**

```ts
import { describe, expect, it } from 'vitest';
import { runQualityChecks } from '../quality-service';

describe('runQualityChecks', () => {
  it('flags pages with missing visuals and open questions', () => {
    const result = runQualityChecks({
      openQuestions: ['封面品牌名待确认'],
      pages: [{ title: '封面', hasVisual: false, density: 'high' }]
    });

    expect(result.issues).toContain('存在待确认内容');
    expect(result.issues).toContain('存在缺少视觉素材的页面');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/quality/__tests__/quality-service.test.ts`
Expected: FAIL because service is missing.

- [ ] **Step 3: Implement quality checks and export IPC**

```ts
// src/services/quality/quality-service.ts
export function runQualityChecks(input: {
  openQuestions: string[];
  pages: Array<{ title: string; hasVisual: boolean; density: 'low' | 'medium' | 'high' }>;
}) {
  const issues: string[] = [];
  if (input.openQuestions.length) issues.push('存在待确认内容');
  if (input.pages.some((page) => !page.hasVisual)) issues.push('存在缺少视觉素材的页面');
  if (input.pages.some((page) => page.density === 'high')) issues.push('存在信息密度较高页面，建议复查');
  return { issues };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/quality/__tests__/quality-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/ipc/export.ts src/services/quality/quality-service.ts src/services/quality/__tests__/quality-service.test.ts src/features/projects/pages/ExportPage.tsx
git commit -m "feat: add export quality checks"
```

### Task 15: Add project persistence and sample architecture documentation

**Files:**
- Modify: `electron/ipc/project-files.ts`
- Create: `docs/architecture/project-structure.md`
- Create: `docs/architecture/image-provider-config.md`

- [ ] **Step 1: Write failing persistence test**

```ts
import { describe, expect, it } from 'vitest';
import { serializeProject } from '../project-files';

describe('serializeProject', () => {
  it('creates JSON snapshot for project export', () => {
    const json = serializeProject({ id: 'p1', name: '招商资料' });
    expect(JSON.parse(json).name).toBe('招商资料');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- electron/ipc/__tests__/project-files.test.ts`
Expected: FAIL because helper is missing.

- [ ] **Step 3: Implement JSON persistence helpers and docs**

```ts
// electron/ipc/project-files.ts
export function serializeProject(project: unknown) {
  return JSON.stringify(project, null, 2);
}
```

Add doc sections covering:

- Electron main / preload / renderer split
- Project JSON storage format
- Why image provider config is stored locally
- Supported `gpt-image-2` endpoints
- `size` and `upscale` behavior notes

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- electron/ipc/__tests__/project-files.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/ipc/project-files.ts electron/ipc/__tests__/project-files.test.ts docs/architecture/project-structure.md docs/architecture/image-provider-config.md
git commit -m "docs: add architecture and image provider docs"
```

### Task 16: Run end-to-end verification and package the MVP

**Files:**
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Create: `scripts/smoke-project.mjs`

- [ ] **Step 1: Write failing smoke automation script expectation**

```js
// scripts/smoke-project.mjs
throw new Error('smoke script not implemented');
```

- [ ] **Step 2: Run script to verify it fails**

Run: `node scripts/smoke-project.mjs`
Expected: FAIL with `smoke script not implemented`

- [ ] **Step 3: Implement smoke script and final verification commands**

```js
// scripts/smoke-project.mjs
import { execSync } from 'node:child_process';

execSync('npm run test', { stdio: 'inherit' });
execSync('npm run e2e -- e2e/workbench-smoke.spec.ts', { stdio: 'inherit' });
```

Final verification command set:

```bash
npm install
npm run test
npm run e2e -- e2e/workbench-smoke.spec.ts
npm run build
node scripts/smoke-project.mjs
```

Expected:

- Unit tests PASS
- E2E smoke PASS
- Build emits `dist/` and `dist-electron/`
- Desktop shell opens project home and route flow without console errors

- [ ] **Step 4: Run verification to confirm everything passes**

Run: `node scripts/smoke-project.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json playwright.config.ts scripts/smoke-project.mjs
git commit -m "chore: add final smoke verification"
```

---

## 3. Spec Coverage Self-Review

### Covered requirements

- 工作台模式：Task 5, 10
- 资料导入与理解：Task 7, 8
- 结构生成：Task 9
- 版式草稿与对比：Task 11
- 本地桌面端形态：Task 1, 2
- 可配置图片生成能力：Task 6, 12, 13
- 导出与质检：Task 14, 15, 16

### Intentional MVP gaps

- 复杂真实解析（如 OCR、PPT 深读）暂用规则化理解服务替代
- 真正的 PPT 导出未纳入本轮实施
- 多人协作与审批流不在 MVP

这些 gaps 与前面的 MVP scope cut 一致，没有遗漏。

### Placeholder scan

- 已避免使用 TBD/TODO/“类似 Task N” 之类占位措辞
- 每个任务都包含明确文件、测试、命令、代码骨架与验证方式

### Type consistency check

- `ProjectStage` 在 store、schema、route flow 中保持一致
- image provider config 固定使用 `baseUrl` / `apiKey` / `model` / `responseFormat`
- `gpt-image-2` 相关 endpoint 命名统一为 `/images/generations` 与 `/images/edits`

---

## 4. Execution Notes

实施顺序建议严格按任务顺序推进，不要跳着做。特别是：

1. 先搭壳（Task 1-5）
2. 再做配置与导入（Task 6-7）
3. 再做理解 / 结构 / 工作台（Task 8-11）
4. 最后接图像能力与导出验证（Task 12-16）

图片相关的重要实施约束：

- `baseUrl` 与 `apiKey` 必须允许用户自定义
- 默认可提供 `https://free.codesonline.dev/v1` 作为初始值，但不能写死成唯一值
- `size` 必须是独立字段，不允许只埋在 prompt 文本里
- `upscale` 要在 UI 里明确说明只是放大，不是重绘
- 图生图必须允许 1 张主图 + 多张参考图路径

---

Plan complete and saved to `docs/superpowers/plans/2026-04-27-ziliao-production-workbench-electron-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
