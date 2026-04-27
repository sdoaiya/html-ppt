import { test, expect } from '@playwright/test';

test('shows app title in desktop shell', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  await expect(page.getByRole('heading', { name: '资料生产工作台' })).toBeVisible();
});
