import { test, expect } from '@playwright/test';

const pollIdRegex = /\/p\/(\w|-){6}$/;

test.describe('Creating polls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Create new boardgame poll', async ({ page }) => {
    await expect(page.getByRole('heading')).toHaveText('Neue Brettspiel-Umfrage erstellen');

    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('Umfrage am Freitag 12.2.');
  
    await page.locator('input[name="participants"]').click();
    await page.locator('input[name="participants"]').fill('3');
  
    await page.locator('input[name="rankingSize"]').click();
    await page.locator('input[name="rankingSize"]').fill('6');
  
    await page.locator('input[name="rankingShortSize"]').click();
    await page.locator('input[name="rankingShortSize"]').fill('2');
  
    await page.getByRole('button', { name: 'Umfrage erstellen' }).click();
  
    await expect(page.getByRole('heading')).toHaveText('Umfrage erfolgreich erstellt!');
    await expect(page.getByLabel('Link zur Umfrage')).toHaveValue(pollIdRegex);
  
    await page.getByRole('button', { name: 'Zur Umfrage' }).click();
  
    await expect(page).toHaveURL(pollIdRegex);
  });
  
  test('Prevent creating poll without name', async ({ page }) => {
    await page.getByRole('button', { name: 'Umfrage erstellen' }).click();

    // Still shows form heading and doesn't got to next page
    await expect(page.getByRole('heading')).toHaveText('Neue Brettspiel-Umfrage erstellen');
  });
});

