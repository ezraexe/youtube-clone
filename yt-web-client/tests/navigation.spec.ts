import { test, expect } from '@playwright/test';

test('basic navigation test', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000/');
  
  // Click on a video
  await page.locator('a:nth-child(34)').click();
  
  // Click logo to return home and wait for navigation
  await Promise.all([
    page.waitForURL('http://localhost:3000/'),
    page.getByRole('link', { name: 'Youtube Logo' }).click()
  ]);
  
  // Verify we're on homepage
  await expect(page).toHaveURL('http://localhost:3000/');
});