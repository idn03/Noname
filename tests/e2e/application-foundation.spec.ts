import { expect, test } from '@playwright/test';

test('Host serves the game home page @browser-preflight', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { name: 'SÓI VÀ CỪU' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'TẠO' })).toBeVisible();
});
