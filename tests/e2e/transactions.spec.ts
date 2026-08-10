import { test, expect } from '@playwright/test';

test.describe('Multistep Transaction Workflow', () => {
  test('should complete full multistep transaction creation wizard', async ({ page }) => {
    await page.goto('/transactions/new?e2e=true');

    // Step 1: Select Achat and proceed
    await expect(page.locator('text=Quel est le type d\'opération ?')).toBeVisible();
    await page.getByRole('button', { name: /Achat/i }).first().click();
    await page.getByRole('button', { name: 'Suivant' }).click();

    // Check step reached
    const accountHeader = page.locator('text=Sur quel compte d\'investissement ?');
    const assetHeader = page.locator('text=Quel est l\'actif concerné ?');

    if (await accountHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
      const accountOption = page.locator('button').filter({ hasText: /PEA|CTO|Enveloppe/i }).first();
      if (await accountOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await accountOption.click();
        await page.getByRole('button', { name: 'Suivant' }).click();
      } else {
        // If no accounts exist in DB, verify warning alert is rendered
        await expect(page.locator('text=Aucun compte trouvé')).toBeVisible();
        return;
      }
    }

    // Step: Asset details
    await expect(assetHeader).toBeVisible();
    await page.getByPlaceholder('CW8').fill('CW8');
    await page.getByPlaceholder('Ex: Amundi MSCI World UCITS ETF').fill('Amundi MSCI World');
    await page.getByRole('button', { name: 'Suivant' }).click();

    // Step: Financials & Calculation Verification
    await expect(page.locator('text=Montants financiers')).toBeVisible();
    await page.getByPlaceholder('10').fill('10');
    await page.getByPlaceholder('500').fill('500');
    await page.getByPlaceholder('0').fill('2.50');

    // Verify calculated total (10 * 500 + 2.50 = 5002.50 €)
    await expect(page.locator('text=5002.50 €')).toBeVisible();
  });
});
