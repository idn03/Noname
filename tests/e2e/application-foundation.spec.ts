import { expect, test } from '@playwright/test';

test('Host serves the player lobby home page', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { name: 'Cùng vào phòng' })).toBeVisible();
});
