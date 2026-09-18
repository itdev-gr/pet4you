import { test, expect } from '@playwright/test';

test('harness PDP has variants, gallery, editorial and accordions', async ({ page }, testInfo) => {
  await page.goto('/proion/samaraki-anesis');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Σαμαράκι άνεσης');
  await expect(page.getByText('Με ΦΠΑ', { exact: true })).toBeVisible();
  const medium = page.getByRole('button', { name: 'M', exact: true });
  await medium.click();
  await expect(medium).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Περιγραφή & χαρακτηριστικά', exact: true })).toHaveAttribute('aria-expanded', 'true');
  const care = page.getByRole('button', { name: 'Φροντίδα & καθαρισμός', exact: true });
  await care.click();
  await expect(care).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Περιγραφή & χαρακτηριστικά', exact: true }).click();
  // Ο αριθμός λήψεων εξαρτάται από όσες έχει ανεβάσει ο merchant — το test
  // ελέγχει τη συμπεριφορά, όχι συγκεκριμένο πλήθος.
  const thumbs = page.getByRole('button', { name: /^Εικόνα \d+ από \d+$/ });
  const thumbCount = await thumbs.count();
  expect(thumbCount).toBeGreaterThan(1);
  await expect(thumbs.first()).toBeVisible();
  await thumbs.nth(1).click();
  await expect(thumbs.nth(1)).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('heading', { name: 'Άνεση σε κάθε βήμα.', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath('pdp.png'), fullPage: true });
});
