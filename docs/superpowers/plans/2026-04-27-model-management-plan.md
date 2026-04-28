# Model Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为资料生产系统增加双槽模型配置能力，让理解链路和生图链路分别读取独立模型设置，并在设置页展示清晰状态。

**Architecture:** 在现有 Electron Store 配置上，从单一 `imageProvider` 扩展为 `understandingProvider + imageProvider` 双对象结构。设置页拆成“状态总览卡 + 理解模型卡 + 生图模型卡”，理解模型支持 `OpenAI Compatible + OpenRouter`，工作台和理解服务分别读取对应配置。

**Tech Stack:** Electron, React, TypeScript, Zustand, Electron Store, Vitest, Testing Library, OpenAI-compatible HTTP config shape

---

## File Structure

- Modify: `electron/ipc/app-config.ts`
  责任：理解模型与生图模型配置的 IPC 读写接口

- Modify: `electron/services/store.ts`
  责任：双槽 provider 默认配置与本地持久化 schema

- Modify: `electron/preload.ts`
- Modify: `src/types/electron.d.ts`
  责任：把理解模型配置 API 暴露到 renderer

- Modify: `src/features/settings/pages/SettingsPage.tsx`
  责任：设置页重构为状态总览 + 理解模型 + 生图模型

- Create: `src/components/settings/UnderstandingProviderForm.tsx`
  责任：理解模型配置表单，支持 OpenAI Compatible / OpenRouter

- Modify: `src/components/settings/ImageProviderForm.tsx`
  责任：与理解模型卡并排协作，保持独立用途说明

- Modify: `src/features/settings/__tests__/ImageProviderForm.test.tsx`
- Create: `src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`
  责任：设置页模型管理回归测试

- Modify: `src/features/projects/pages/WorkbenchPage.tsx`
  责任：工作台继续读取生图模型配置，并显示更明确的 provider 状态

- Modify: `src/services/ai/understanding-client.ts`
  责任：理解模型配置对象与 provider 路由接口

---

## Scope Cut

本轮只实现：

- 一个理解模型槽位
- 一个生图模型槽位
- 理解模型支持 OpenAI Compatible / OpenRouter
- 生图模型继续走 OpenAI Compatible

本轮不实现：

- 多理解模型列表
- 多生图模型列表
- 自动 fallback
- 多模型自动路由

---

### Task 1: Extend config schema for understandingProvider

**Files:**
- Modify: `electron/ipc/app-config.ts`
- Modify: `electron/services/store.ts`
- Test: `src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`

- [ ] **Step 1: Write the failing config shape test**

```tsx
test('saves provider, baseUrl, apiKey, and model for understanding provider', async () => {
  const onSave = vi.fn();
  render(
    <UnderstandingProviderForm
      initial={{ provider: 'openai_compatible', baseUrl: '', apiKey: '', model: '' }}
      onSave={onSave}
    />
  );

  await userEvent.selectOptions(screen.getByLabelText('理解模型 Provider'), 'openrouter');
  await userEvent.type(screen.getByLabelText('理解模型 API Key'), 'sk-or-test');
  await userEvent.type(screen.getByLabelText('理解模型 Model'), 'openrouter/auto');
  await userEvent.click(screen.getByRole('button', { name: '保存理解模型' }));

  expect(onSave).toHaveBeenCalledWith({
    provider: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: 'sk-or-test',
    model: 'openrouter/auto'
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`
Expected: FAIL because the form does not exist yet.

- [ ] **Step 3: Add understanding provider config types and defaults**

Add these types:

```ts
export type UnderstandingProviderConfig = {
  provider: 'openai_compatible' | 'openrouter';
  baseUrl: string;
  apiKey: string;
  model: string;
};
```

And defaults:

```ts
{
  provider: 'openai_compatible',
  baseUrl: '',
  apiKey: '',
  model: ''
}
```

Persist it under `understandingProvider` in Electron Store.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/ipc/app-config.ts electron/services/store.ts src/features/settings/__tests__/UnderstandingProviderForm.test.tsx
git commit -m "feat: add understanding provider config"
```

### Task 2: Build UnderstandingProviderForm

**Files:**
- Create: `src/components/settings/UnderstandingProviderForm.tsx`
- Test: `src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`

- [ ] **Step 1: Write the failing provider switch behavior test**

```tsx
test('prefills OpenRouter base url when provider switches to openrouter', async () => {
  render(
    <UnderstandingProviderForm
      initial={{ provider: 'openai_compatible', baseUrl: '', apiKey: '', model: '' }}
      onSave={vi.fn()}
    />
  );

  await userEvent.selectOptions(screen.getByLabelText('理解模型 Provider'), 'openrouter');
  expect(screen.getByLabelText('理解模型 Base URL')).toHaveValue('https://openrouter.ai/api/v1');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`
Expected: FAIL because switch logic does not exist.

- [ ] **Step 3: Implement UnderstandingProviderForm**

Requirements:

- Fields:
  - Provider
  - Base URL
  - API Key
  - Model
- When provider becomes `openrouter`, if baseUrl is empty, auto-fill `https://openrouter.ai/api/v1`
- Save button text: `保存理解模型`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/settings/UnderstandingProviderForm.tsx src/features/settings/__tests__/UnderstandingProviderForm.test.tsx
git commit -m "feat: add understanding model form"
```

### Task 3: Upgrade settings page into model console

**Files:**
- Modify: `src/features/settings/pages/SettingsPage.tsx`
- Modify: `src/styles/globals.css`
- Modify: `src/features/settings/__tests__/ImageProviderForm.test.tsx`

- [ ] **Step 1: Write the failing settings console test**

```tsx
test('shows status summary for understanding and image models', () => {
  render(<SettingsPage />);
  expect(screen.getByText('理解模型')).toBeInTheDocument();
  expect(screen.getByText('生图模型')).toBeInTheDocument();
  expect(screen.getByText('连接状态')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/settings/__tests__/ImageProviderForm.test.tsx`
Expected: FAIL because settings page still only shows image config.

- [ ] **Step 3: Implement settings console layout**

The page should render:

```tsx
<section className="panel status-panel">
  <h3>连接状态</h3>
  <p>理解模型：已配置 / 未配置</p>
  <p>生图模型：已配置 / 未配置</p>
</section>

<section className="settings-grid">
  <UnderstandingProviderForm ... />
  <ImageProviderForm ... />
</section>
```

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm run test -- src/features/settings/__tests__/ImageProviderForm.test.tsx src/features/settings/__tests__/UnderstandingProviderForm.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/settings/pages/SettingsPage.tsx src/styles/globals.css src/features/settings/__tests__/ImageProviderForm.test.tsx
git commit -m "feat: turn settings into model console"
```

### Task 4: Expose understanding provider APIs to renderer

**Files:**
- Modify: `electron/preload.ts`
- Modify: `src/types/electron.d.ts`

- [ ] **Step 1: Write the failing API shape test**

```ts
expectTypeOf(window.desktopBridge.getUnderstandingProviderConfig).toBeFunction();
expectTypeOf(window.desktopBridge.setUnderstandingProviderConfig).toBeFunction();
```

- [ ] **Step 2: Run test/typecheck to verify it fails**

Run: `npm run build`
Expected: FAIL or missing type members.

- [ ] **Step 3: Implement preload and type bridge**

Add:

```ts
getUnderstandingProviderConfig: () => ipcRenderer.invoke('config:get-understanding-provider')
setUnderstandingProviderConfig: (payload) => ipcRenderer.invoke('config:set-understanding-provider', payload)
```

- [ ] **Step 4: Run build to verify it passes**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/preload.ts src/types/electron.d.ts
git commit -m "feat: expose understanding provider bridge"
```

### Task 5: Route understanding client by provider type

**Files:**
- Modify: `src/services/ai/understanding-client.ts`

- [ ] **Step 1: Write the failing provider route test**

```ts
it('builds request config for openrouter provider', async () => {
  const result = buildUnderstandingRequestConfig({
    provider: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: 'sk-test',
    model: 'openrouter/auto'
  });

  expect(result.baseUrl).toBe('https://openrouter.ai/api/v1');
  expect(result.model).toBe('openrouter/auto');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/ai/__tests__/understanding-client.test.ts`
Expected: FAIL because helper does not exist.

- [ ] **Step 3: Implement provider-aware understanding client helper**

Minimal behavior:

- `openai_compatible` returns user-provided baseUrl/model
- `openrouter` returns user-provided or default OpenRouter baseUrl/model

Do not wire actual remote requests yet; just provide correct request config shape.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/ai/__tests__/understanding-client.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/ai/understanding-client.ts src/services/ai/__tests__/understanding-client.test.ts
git commit -m "feat: route understanding provider by type"
```

---

## Spec Coverage Self-Review

Covered:

- 双槽模型配置：Task 1, 2, 3
- 理解模型支持 OpenAI Compatible / OpenRouter：Task 1, 2, 5
- 生图模型保留独立槽位：Task 3
- 设置页状态总览：Task 3
- renderer 读取理解模型配置：Task 4

Not included by design:

- 多模型列表
- 自动 fallback
- 多模型路由策略

## Placeholder Scan

No placeholder steps remain. Deferred remote AI invocation is explicitly out of scope for this round.

## Type Consistency Check

- `understandingProvider` is the single config object for理解模型
- `imageProvider` remains the existing生图模型 object
- `provider` values are only `openai_compatible | openrouter`

---

Plan complete and saved to `docs/superpowers/plans/2026-04-27-model-management-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
