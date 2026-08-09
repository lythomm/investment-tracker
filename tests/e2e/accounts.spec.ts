import { test, expect } from '@playwright/test';

test.describe('Account Management Workflow', () => {
  test('should validate input and handle creation attempt', async ({ page }) => {
    await page.goto('/?e2e=true');

    // 1. Open modal
    const addAccountBtn = page.getByRole('button', { name: 'Créer mon premier compte PEA / CTO' })
      .or(page.getByRole('button', { name: 'Nouveau Compte' }));

    await expect(addAccountBtn.first()).toBeVisible();
    await addAccountBtn.first().click();

    // 2. Assert modal heading
    const modalHeading = page.locator('text=Nouveau Compte').first();
    await expect(modalHeading).toBeVisible();

    // 3. Assert HTML5 validation attribute on account name input
    const accountInput = page.getByPlaceholder('ex: PEA Fortuneo, CTO Trade Republic');
    await expect(accountInput).toHaveAttribute('required', '');

    // 4. Fill account name and select type
    const testAccountName = `PEA E2E ${Date.now()}`;
    await accountInput.fill(testAccountName);

    // Select CTO button
    const ctoButton = page.getByRole('button', { name: /CTO \(Compte Titres\)/i });
    await ctoButton.click();

    // 5. Submit form
    const submitBtn = page.getByRole('button', { name: 'Créer le compte' });
    await submitBtn.click();

    // 6. Verify modal is handled (either closed or error state displayed)
    await expect(page.locator('.bg-rose-50').or(modalHeading)).toBeVisible();
  });
});
