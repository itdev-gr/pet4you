import { test, expect } from '@playwright/test';

test('blog index opens a seeded published article and returns to index', async ({ page }, testInfo) => {
  await page.goto('/blog');
  await expect(page.locator('main article')).toHaveCount(3);
  await page.locator('main article').first().getByRole('link').click();
  await expect(page).toHaveURL(/\/blog\/pos-epilego-ti-sosti-trofi$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Πώς επιλέγω τη σωστή τροφή;');
  await expect(page.locator('main time')).toBeVisible();
  await expect(page.locator('main article')).toContainText('7–10 ημέρες');
  await page.screenshot({ path: testInfo.outputPath('article.png'), fullPage: true });
  await page.getByRole('link', { name: '← Όλα τα άρθρα', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test('static shipping page renders formatted CMS content', async ({ page }, testInfo) => {
  await page.goto('/selida/apostoles');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Αποστολές');
  await expect(page.locator('main article strong')).toContainText('39');
  await expect(page.locator('main article')).not.toContainText('**');
  await page.screenshot({ path: testInfo.outputPath('static.png'), fullPage: true });
});

test('unknown article and static slugs render not-found with noindex', async ({ page }) => {
  for (const path of ['/blog/qa-missing-content', '/selida/qa-missing-content']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ουπς! Χαθήκαμε λίγο.');
  }
});
