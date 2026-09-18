import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});

test('homepage exposes seeded catalog and editorial sections in order', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Η ευτυχία τους,');
  const headings = await page.locator('main h2').allTextContents();
  const required = ['Για ποιον ψωνίζουμε;', 'Τα αγαπημένα τους. Και δικά σου.', 'New Products', 'Τα brands που αγαπάς, όλα εδώ.', 'Η φροντίδα δεν σταματά στο καλάθι.', 'Μικρές συμβουλές. Μεγάλη αγάπη.'];
  let previous = -1;
  for (const heading of required) {
    const index = headings.indexOf(heading);
    expect(index, heading).toBeGreaterThan(previous);
    previous = index;
  }
  const categories = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Για ποιον ψωνίζουμε;', exact: true }) });
  await expect(categories.getByRole('link')).toHaveCount(6);
  await expect(categories.getByRole('link', { name: 'Ερπετά', exact: true })).toBeVisible();
});

test('collection filters change the displayed products', async ({ page }) => {
  const products = page.locator('#collection-products');
  const before = await products.locator('article h3').allTextContents();
  expect(before.length).toBeGreaterThan(0);
  const catFilter = page
    .getByRole('group', { name: 'Φίλτρα συλλογών' })
    .getByRole('button', { name: 'Γάτα', exact: true });
  await catFilter.click();
  await expect(catFilter).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => products.locator('article h3').allTextContents()).not.toEqual(before);
});

test('newsletter requires consent without sending a subscription', async ({ page }) => {
  let submissions = 0;
  await page.route('**/api/newsletter', async route => {
    submissions++;
    await route.fulfill({ status: 500, body: '{}' });
  });
  await page.getByRole('textbox', { name: 'Το email σου', exact: true }).fill('qa@example.com');
  await page.getByRole('button', { name: 'Εγγραφή', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('συγκατάθεσή');
  expect(submissions).toBe(0);
});

test('page fits the viewport and produces a review screenshot', async ({ page }, testInfo) => {
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
});

test('header search is available at this viewport', async ({ page }) => {
  await expect(page.getByRole('banner').getByRole('searchbox')).toBeVisible();
});
