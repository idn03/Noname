import { expect, test } from '@playwright/test';

test.use({ launchOptions: { args: ['--host-resolver-rules=MAP player.test 127.0.0.1'] } });

test('Host reveals rules before enabling create and bouncing once', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const title = page.locator('#page-title');
  const create = page.locator('button[aria-describedby="host-create-note"]');
  await expect(title).toHaveCSS('animation-delay', '1s');
  await expect(create).toBeDisabled();
  await expect(create).toHaveCSS('animation-duration', '1s');
  await expect(page.locator('#rules-heading')).toBeVisible();
  await expect(create).toBeEnabled();
  await expect(create).toHaveCSS('animation-name', 'button-enable-bounce');
  await expect(create).toHaveCSS('animation-iteration-count', '1');
});

test('reduced motion immediately exposes the connected Host action', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#page-title')).toHaveCSS('animation-name', 'none');
  const create = page.getByRole('button', { name: 'TẠO' });
  await expect(create).toBeEnabled();
  await expect(create).toHaveCSS('animation-name', 'none');
});

test('mobile Join staggers input and rule navigation after the heading', async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const url = new URL('/', baseURL);
  url.hostname = 'player.test';
  await page.goto(url.href);
  const form = page.locator('form').locator('..');
  await expect(page.locator('#page-title')).toHaveCSS('animation-delay', '1s');
  await expect(form).toHaveCSS('animation-delay', '1.32s');
  const tabs = page.locator('nav button');
  await expect(tabs.first()).toHaveCSS('animation-delay', '1.48s');
  await expect(tabs.last()).toHaveCSS('animation-delay', '1.72s');
  await page.getByLabel('Tên hiển thị').fill('An');
  await tabs.last().click();
  await expect(page).toHaveURL(/\/sheep-team$/);
});
