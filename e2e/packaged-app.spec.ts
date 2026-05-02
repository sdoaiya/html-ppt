import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect, _electron as electron } from '@playwright/test';

test('packaged app launches and basic navigation works', async () => {
  test.setTimeout(60_000);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const executablePath = path.resolve(__dirname, '../release/win-unpacked/资料生产工作台.exe');
  const app = await electron.launch({ executablePath });

  try {
    const page = await app.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('把资料变成可交付成品，整个过程都看得见。')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: '新建项目' }).click();
    await expect(page.getByText('先把原始资料放进来')).toBeVisible();

    await page.getByRole('button', { name: '开始解析资料' }).click();
    await expect(page.getByText('先确定你想生成什么')).toBeVisible();

    await page.getByRole('button', { name: '确认类型，进入理解' }).click();
    await expect(page.getByRole('heading', { name: '理解资料' })).toBeVisible();

    await page.getByRole('button', { name: '确认理解，继续配置' }).click();
    await expect(page.getByText('把底层能力翻译成你听得懂的组合配置')).toBeVisible();

    await page.getByRole('button', { name: '确认配置，开始生成' }).click();
    await expect(page.getByText('系统正在生成资料草稿')).toBeVisible();

    await page.getByRole('link', { name: '预览微调' }).click();
    await expect(page.getByText('章节大纲')).toBeVisible();

    await page.getByRole('button', { name: '进入导出' }).click();
    await expect(page.getByText('生成完成后，直接拿走你真正要交付的文件。')).toBeVisible();
  } finally {
    await app.close();
  }
});
