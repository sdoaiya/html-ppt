import { existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect, _electron as electron } from '@playwright/test';

function getPaths() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  return {
    executablePath: path.resolve(__dirname, '../release/win-unpacked/资料生产工作台.exe'),
    importFilePath: path.resolve(__dirname, './fixtures/sample-import.txt'),
    exportFilePath: path.resolve(__dirname, '../test-results/exported-project.json')
  };
}

test('packaged app persists OCR settings across relaunch', async () => {
  test.setTimeout(60_000);
  const { executablePath } = getPaths();
  const uniqueModel = `PaddleOCR-Test-${Date.now()}`;

  const firstApp = await electron.launch({ executablePath });

  try {
    const page = await firstApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('把资料变成可交付成品，整个过程都看得见。')).toBeVisible({ timeout: 15_000 });

    await page.getByText('⚙ 设置').click();
    await expect(page.getByLabel('OCR API URL')).toBeVisible();
    await page.getByLabel('OCR Model').fill(uniqueModel);
    await page.getByRole('button', { name: '保存 OCR 配置' }).click();
    await expect(page.getByText('OCR 配置已保存')).toBeVisible();
  } finally {
    await firstApp.close();
  }

  const secondApp = await electron.launch({ executablePath });

  try {
    const page = await secondApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('把资料变成可交付成品，整个过程都看得见。')).toBeVisible({ timeout: 15_000 });

    await page.getByText('⚙ 设置').click();
    await expect(page.getByLabel('OCR Model')).toHaveValue(uniqueModel);
  } finally {
    await secondApp.close();
  }
});

test('packaged app imports a real txt file and exports project json', async () => {
  test.setTimeout(60_000);
  const { executablePath, importFilePath, exportFilePath } = getPaths();

  rmSync(exportFilePath, { force: true });

  const app = await electron.launch({ executablePath });

  try {
    await app.evaluate(async ({ dialog }, values) => {
      dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [values.importFilePath] });
      dialog.showSaveDialog = async () => ({ canceled: false, filePath: values.exportFilePath });
    }, { importFilePath, exportFilePath });

    const page = await app.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('把资料变成可交付成品，整个过程都看得见。')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: '新建项目' }).click();
    await page.getByRole('button', { name: '选择本地文件' }).click();
    await expect(page.getByText('sample-import.txt')).toBeVisible();
    await page.getByRole('button', { name: '开始解析资料' }).click();
    await expect(page.getByText('先确定你想生成什么')).toBeVisible();

    await page.getByRole('button', { name: '确认类型，继续配置' }).click();
    await page.getByRole('button', { name: '确认配置，进入预览' }).click();
    await page.getByRole('button', { name: '进入导出' }).click();
    await page.getByRole('button', { name: '导出项目 JSON' }).click();
    await expect(page.getByText('已导出到')).toBeVisible();
    await expect(page.getByText('最近导出结果')).toBeVisible();

    expect(existsSync(exportFilePath)).toBe(true);
    const exported = JSON.parse(readFileSync(exportFilePath, 'utf8')) as { sources?: Array<{ name?: string }> };
    expect(exported.sources?.[0]?.name).toBe('sample-import.txt');
  } finally {
    await app.close();
    rmSync(exportFilePath, { force: true });
  }
});
