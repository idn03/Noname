import { expect, test } from '@playwright/test';

test('Host serves the Noname home page', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { name: 'Noname' })).toBeVisible();
});
