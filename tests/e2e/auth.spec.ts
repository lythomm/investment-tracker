import { test, expect } from '@playwright/test';

test.describe('Authentication Screen', () => {
  test('should display login form and toggle between Sign In and Sign Up', async ({ page }) => {
    await page.goto('/');

    // Check brand title on Auth Screen
    await expect(page.locator('h1').filter({ hasText: 'Folio' })).toBeVisible();

    // Check tabs
    const signInBtn = page.getByRole('button', { name: 'Se connecter' });
    const signUpBtn = page.getByRole('button', { name: 'Créer un compte' });

    await expect(signInBtn).toBeVisible();
    await expect(signUpBtn).toBeVisible();

    // Toggle tab
    await signUpBtn.click();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();

    await signInBtn.click();
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeVisible();
  });
});
