# Real File Processing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让资料生产工作台支持真实文本类与表格类文件输入，通过本地抽取内容块，再交给 LLM 生成理解结果与结构建议。

**Architecture:** 在现有 Electron + React + Zustand 架构中新增“文件抽取层”和“内容理解层”。Electron 侧负责真实文件读取与安全 IPC，renderer 侧负责将不同格式统一为内容块，再用 AI 理解服务基于内容块生成摘要、重点和结构建议，并把结果接入理解页、结构页和工作台资料区。

**Tech Stack:** Electron, React, TypeScript, Zustand, Vitest, Testing Library, Vite, Node fs/path, csv-parse, xlsx, mammoth, pdf-parse, OpenAI-compatible AI service

---

## File Structure

本轮实现需要新增和修改以下文件：

- Modify: `src/domain/projects/types.ts`
  责任：定义真实文件抽取结果、内容块、理解结果的类型

- Modify: `src/stores/project-store.ts`
  责任：存储真实文件抽取结果与理解结果

- Modify: `electron/ipc/project-files.ts`
  责任：文件选择 + 文件内容读取 IPC

- Modify: `electron/preload.ts`
- Modify: `src/types/electron.d.ts`
  责任：将真实文件读取能力暴露给 renderer

- Create: `src/services/files/text-extractors.ts`
  责任：txt / md / docx / pdf 文本提取入口

- Create: `src/services/files/table-extractors.ts`
  责任：xlsx / csv 表格提取入口

- Modify: `src/services/files/import-service.ts`
  责任：统一内容块结构与抽取结果工厂

- Modify: `src/services/understanding/understanding-service.ts`
  责任：从“只看文件名”升级为“看内容块”生成理解结果

- Create: `src/services/ai/understanding-client.ts`
  责任：LLM 理解调用入口

- Modify: `src/features/projects/pages/ImportPage.tsx`
  责任：真实文件选择、文件列表与解析状态

- Modify: `src/features/projects/pages/UnderstandingPage.tsx`
  责任：展示真实提取摘要、重点信息与系统建议

- Modify: `src/features/projects/pages/StructurePage.tsx`
  责任：使用真实理解结果生成结构建议

- Modify: `src/components/workbench/SourcePanel.tsx`
  责任：展示真实文件和抽取状态

- Modify: `src/features/projects/pages/WorkbenchPage.tsx`
  责任：工作台左栏与真实文件处理结果联动

- Create: `src/services/files/__tests__/text-extractors.test.ts`
- Create: `src/services/files/__tests__/table-extractors.test.ts`
- Modify: `src/services/files/__tests__/import-service.test.ts`
- Modify: `src/services/understanding/__tests__/understanding-service.test.ts`
- Modify: `src/features/projects/pages/ProjectFlowPages.test.tsx`
  责任：真实文件处理回归测试

---

## Scope Cut

本计划只覆盖：

- `txt / md / docx / pdf`
- `xlsx / csv`
- 本地抽取 + LLM 理解

本计划不覆盖：

- OCR
- 图片理解
- 音频转写
- 图生图
- PDF/PPT 高保真导出

---

### Task 1: Extend project domain for extracted content

**Files:**
- Modify: `src/domain/projects/types.ts`
- Modify: `src/stores/project-store.ts`
- Test: `src/stores/__tests__/project-store.test.ts`

- [ ] **Step 1: Write the failing store test for extracted content state**

```ts
it('stores extracted content blocks and understanding result', () => {
  useProjectStore.getState().createProject('真实资料', '做成招商汇报');
  useProjectStore.getState().setExtractedSources([
    {
      id: 'f1',
      name: '业务介绍.docx',
      kind: 'document',
      path: '业务介绍.docx',
      status: 'ready',
      blocks: [{ type: 'paragraph', text: '业务介绍内容' }]
    }
  ]);
  useProjectStore.getState().setUnderstanding({ summary: '已提取真实资料内容' });

  expect(useProjectStore.getState().currentProject?.sources[0]).toMatchObject({ name: '业务介绍.docx' });
  expect(useProjectStore.getState().currentProject?.understanding).toEqual({ summary: '已提取真实资料内容' });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/stores/__tests__/project-store.test.ts`
Expected: FAIL because `setExtractedSources` and block types do not exist yet.

- [ ] **Step 3: Add extracted content types and store actions**

Add these types:

```ts
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet_list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'table_summary'; text: string };

export type ExtractedSourceAsset = SourceAsset & {
  extractStatus?: 'pending' | 'success' | 'error';
  blocks?: ContentBlock[];
  extractSummary?: string;
  extractError?: string;
};
```

Then add store action:

```ts
setExtractedSources: (sources: ExtractedSourceAsset[]) => void;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/stores/__tests__/project-store.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/projects/types.ts src/stores/project-store.ts src/stores/__tests__/project-store.test.ts
git commit -m "feat: add extracted content types"
```

### Task 2: Add text extractor layer

**Files:**
- Create: `src/services/files/text-extractors.ts`
- Test: `src/services/files/__tests__/text-extractors.test.ts`

- [ ] **Step 1: Write failing text extractor tests**

```ts
describe('extractTextBlocks', () => {
  it('splits plain text into paragraph blocks', async () => {
    const blocks = await extractTextBlocks({
      kind: 'document',
      name: 'note.txt',
      content: '第一段\n\n第二段'
    });

    expect(blocks).toEqual([
      { type: 'paragraph', text: '第一段' },
      { type: 'paragraph', text: '第二段' }
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/files/__tests__/text-extractors.test.ts`
Expected: FAIL because extractor does not exist.

- [ ] **Step 3: Implement text extractors**

Implement minimal support for:

- `txt`
- `md`
- already-extracted `docx` text
- already-extracted `pdf` text

Use a function shape like:

```ts
export async function extractTextBlocks(input: {
  kind: 'document';
  name: string;
  content: string;
}): Promise<ContentBlock[]> {
  return input.content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'paragraph', text }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/files/__tests__/text-extractors.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/files/text-extractors.ts src/services/files/__tests__/text-extractors.test.ts
git commit -m "feat: add text extraction layer"
```

### Task 3: Add table extractor layer

**Files:**
- Create: `src/services/files/table-extractors.ts`
- Test: `src/services/files/__tests__/table-extractors.test.ts`

- [ ] **Step 1: Write failing table extractor tests**

```ts
describe('extractTableBlocks', () => {
  it('converts csv rows to table blocks and summary', async () => {
    const blocks = await extractTableBlocks({
      kind: 'spreadsheet',
      name: 'data.csv',
      rows: [
        ['地区', '销售额'],
        ['华北', '120'],
        ['华东', '160']
      ]
    });

    expect(blocks[0]).toMatchObject({ type: 'table' });
    expect(blocks[1]).toMatchObject({ type: 'table_summary' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/files/__tests__/table-extractors.test.ts`
Expected: FAIL because extractor does not exist.

- [ ] **Step 3: Implement table extraction**

Use a function shape like:

```ts
export async function extractTableBlocks(input: {
  kind: 'spreadsheet';
  name: string;
  rows: string[][];
}): Promise<ContentBlock[]> {
  const [headers, ...dataRows] = input.rows;
  return [
    { type: 'table', headers, rows: dataRows },
    { type: 'table_summary', text: `${input.name} 包含 ${dataRows.length} 行数据，字段：${headers.join('、')}` }
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/files/__tests__/table-extractors.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/files/table-extractors.ts src/services/files/__tests__/table-extractors.test.ts
git commit -m "feat: add table extraction layer"
```

### Task 4: Upgrade import service into real extracted source pipeline

**Files:**
- Modify: `src/services/files/import-service.ts`
- Modify: `src/services/files/__tests__/import-service.test.ts`

- [ ] **Step 1: Write failing extracted-source test**

```ts
it('creates extracted source assets with content blocks', async () => {
  const result = await createExtractedSourceAsset({
    path: 'note.txt',
    name: 'note.txt',
    kind: 'document',
    rawContent: '第一段\n\n第二段'
  });

  expect(result.extractStatus).toBe('success');
  expect(result.blocks?.length).toBe(2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/files/__tests__/import-service.test.ts`
Expected: FAIL because `createExtractedSourceAsset` does not exist.

- [ ] **Step 3: Implement extracted-source factory**

Add a new factory:

```ts
export async function createExtractedSourceAsset(input: {
  path: string;
  name: string;
  kind: ExtractedSourceAsset['kind'];
  rawContent?: string;
  rows?: string[][];
}): Promise<ExtractedSourceAsset> {
  // route to text or table extractors
}
```

Behavior:

- text kinds → `extractTextBlocks`
- spreadsheet kinds → `extractTableBlocks`
- set `extractStatus` to `success` or `error`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/files/__tests__/import-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/files/import-service.ts src/services/files/__tests__/import-service.test.ts
git commit -m "feat: build extracted source pipeline"
```

### Task 5: Add Electron file-read IPC for real content

**Files:**
- Modify: `electron/ipc/project-files.ts`
- Modify: `electron/preload.ts`
- Modify: `src/types/electron.d.ts`

- [ ] **Step 1: Write failing IPC helper test**

```ts
it('serializes file payload with utf8 text content', async () => {
  const payload = normalizeFilePayload({
    path: 'note.txt',
    name: 'note.txt',
    ext: 'txt',
    content: 'hello'
  });

  expect(payload.content).toBe('hello');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- electron/ipc/__tests__/project-files.test.ts`
Expected: FAIL because helper does not exist.

- [ ] **Step 3: Implement file-read IPC**

Extend the IPC with:

```ts
ipcMain.handle('project-files:read', async (_event, filePaths: string[]) => {
  // read text files as utf8
  // parse csv as row arrays
  // return normalized payloads
});
```

And preload API:

```ts
readProjectFiles: (paths: string[]) => ipcRenderer.invoke('project-files:read', paths)
```

First phase only needs working support for:

- `.txt`
- `.md`
- `.csv`

For `.docx`, `.pdf`, `.xlsx`, return a normalized stub payload if local parser integration is not wired yet, but include a clear `extractStatus: 'pending'` path in follow-up tasks. Do not fake success without content.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- electron/ipc/__tests__/project-files.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add electron/ipc/project-files.ts electron/preload.ts src/types/electron.d.ts electron/ipc/__tests__/project-files.test.ts
git commit -m "feat: add real file read ipc"
```

### Task 6: Upgrade understanding service to use extracted content blocks

**Files:**
- Modify: `src/services/understanding/understanding-service.ts`
- Modify: `src/services/understanding/__tests__/understanding-service.test.ts`
- Create: `src/services/ai/understanding-client.ts`

- [ ] **Step 1: Write failing understanding-from-blocks test**

```ts
it('summarizes extracted text and table blocks', () => {
  const result = buildUnderstanding({
    brief: '做成招商汇报',
    sources: [
      {
        id: '1',
        name: '业务介绍.docx',
        kind: 'document',
        path: 'x',
        status: 'ready',
        blocks: [{ type: 'paragraph', text: '业务优势是渠道覆盖全国' }]
      }
    ]
  });

  expect(result.keyPoints[0]).toContain('业务优势');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/services/understanding/__tests__/understanding-service.test.ts`
Expected: FAIL because service only reflects filenames/kinds.

- [ ] **Step 3: Implement content-block-aware understanding**

Implement minimal behavior:

- Paragraph blocks contribute to `keyPoints`
- Table summary blocks contribute to `visualizable`
- `summary` references real extracted material, not just filenames

Also create a placeholder AI client shape for later enhancement:

```ts
export async function buildUnderstandingWithAi(...) {
  // TODO later: send extracted summaries to LLM
}
```

Do not wire remote AI yet in this task; just establish the interface.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/services/understanding/__tests__/understanding-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/understanding/understanding-service.ts src/services/understanding/__tests__/understanding-service.test.ts src/services/ai/understanding-client.ts
git commit -m "feat: derive understanding from extracted content"
```

### Task 7: Wire real file data into import and understanding pages

**Files:**
- Modify: `src/features/projects/pages/ImportPage.tsx`
- Modify: `src/features/projects/pages/UnderstandingPage.tsx`
- Modify: `src/features/projects/pages/ProjectFlowPages.test.tsx`

- [ ] **Step 1: Write failing page-flow test for real file results**

```tsx
test('understanding page shows extracted source summaries', () => {
  render(<UnderstandingPage />);
  expect(screen.getByText('业务介绍.docx')).toBeInTheDocument();
  expect(screen.getByText(/当前内容生成输入/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/projects/pages/ProjectFlowPages.test.tsx`
Expected: FAIL because extracted summaries are not rendered.

- [ ] **Step 3: Implement import-page real file flow**

Behavior:

- `选择资料文件` calls `pickProjectFiles`
- submit path reads chosen files via `readProjectFiles`
- converts payloads with `createExtractedSourceAsset`
- stores extracted sources in `project-store`

Understanding page should render:

- file name
- extract status
- extract summary if present

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/projects/pages/ProjectFlowPages.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/projects/pages/ImportPage.tsx src/features/projects/pages/UnderstandingPage.tsx src/features/projects/pages/ProjectFlowPages.test.tsx
git commit -m "feat: wire real extracted files into understanding page"
```

### Task 8: Use real understanding results to drive structure and workbench

**Files:**
- Modify: `src/features/projects/pages/StructurePage.tsx`
- Modify: `src/components/workbench/SourcePanel.tsx`
- Modify: `src/features/projects/pages/WorkbenchPage.tsx`
- Modify: `src/features/projects/pages/WorkbenchPage.test.tsx`

- [ ] **Step 1: Write failing structure/workbench test**

```tsx
test('workbench shows extracted source names and structure from real data', () => {
  render(<WorkbenchPage />);
  expect(screen.getByText('业务介绍.docx')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: FAIL because workbench is not yet grounded in extracted-source metadata.

- [ ] **Step 3: Implement real-data wiring**

Structure page:

- if `understanding.structureHints` exists, display and prefer it
- otherwise use current fallback `buildStructure`

Workbench:

- SourcePanel lists extracted file names and kinds
- page prompt generation still uses structure, but structure is now rooted in real sources

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/features/projects/pages/WorkbenchPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/projects/pages/StructurePage.tsx src/components/workbench/SourcePanel.tsx src/features/projects/pages/WorkbenchPage.tsx src/features/projects/pages/WorkbenchPage.test.tsx
git commit -m "feat: connect real file understanding to workbench"
```

---

## Spec Coverage Self-Review

Covered:

- 真实文件选择：Task 5, 7
- 文本类提取：Task 2
- 表格类提取：Task 3
- 统一内容块：Task 1, 4
- LLM 理解接口边界：Task 6
- 理解页、结构页、工作台接入真实数据：Task 7, 8

Intentional gaps:

- OCR
- 图片理解
- 音频转写
- 高保真 docx/pdf/xlsx 解析细节

These align with the approved scope cut.

## Placeholder Scan

No unresolved placeholders in task steps. Any deferred AI capability is explicitly scoped as interface-only, not fake implementation.

## Type Consistency Check

- `ExtractedSourceAsset` extends `SourceAsset`
- `ContentBlock` is referenced consistently across extractors and understanding
- `setExtractedSources` is the store action used downstream by import/understanding/workbench

---

Plan complete and saved to `docs/superpowers/plans/2026-04-27-real-file-processing-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
