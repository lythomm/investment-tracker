import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?e2e=true');
  });

  test('should display navbar and main layout when authenticated', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Tableau de bord' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Positions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Historique' })).toBeVisible();
  });

  test('should display hero banner or initial account creation screen', async ({ page }) => {
    const emptyState = page.locator('text=Bienvenue sur Folio !');
    const heroBanner = page.locator('text=Valeur Totale');

    await expect(emptyState.or(heroBanner)).toBeVisible();
  });

  test('should display fixed bottom navigation bar on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Positions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Historique' })).toBeVisible();
  });
});
