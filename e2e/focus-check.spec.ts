import { test, expect } from '@playwright/test';

test('mobile drawer traps focus and restores it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/');

  const trigger = page.getByRole('button', { name: 'Άνοιγμα μενού' });
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Κύριο μενού' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');

  // Αρχική εστίαση μέσα στο πάνελ
  const insideAtStart = await dialog.evaluate(d => d.contains(document.activeElement));
  expect(insideAtStart, 'αρχική εστίαση μέσα στο drawer').toBe(true);

  // 40 πραγματικά Tab: το focus δεν πρέπει να βγει ποτέ έξω
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const inside = await dialog.evaluate(d => d.contains(document.activeElement));
    expect(inside, `focus έμεινε μέσα μετά από ${i + 1} Tab`).toBe(true);
  }

  // Escape κλείνει και επιστρέφει το focus στο κουμπί
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('desktop mega menu opens with keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/');
  const dogLink = page.getByRole('navigation', { name: 'Κατηγορίες' })
    .getByRole('link', { name: 'Σκύλος', exact: true });
  await dogLink.focus();
  await expect(page.getByRole('link', { name: 'Ξηρά τροφή', exact: true })).toBeVisible();
});
