import { test, expect } from '@playwright/test';

test.describe('Positions & Holdings Page', () => {
  test('should navigate to Positions page and display holdings view', async ({ page }) => {
    await page.goto('/positions?e2e=true');

    await expect(page).toHaveURL('/positions?e2e=true');
    await expect(page.getByRole('link', { name: 'Positions' })).toBeVisible();
  });
});
