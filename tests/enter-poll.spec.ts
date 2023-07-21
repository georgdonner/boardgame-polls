import { test as base, expect } from '@playwright/test';

import boardgames from './data/boardgames.ts';
import type { PollParams } from './fixtures/poll-page.ts';
import { PollPage } from './fixtures/poll-page.ts';

const defaultParams: PollParams = {
  participants: 3,
  rankingSize: 3,
  rankingShortSize: 3,
};

// Extend basic test by providing a "todoPage" fixture.
const test = base.extend<{ pollPage: PollPage, pollParams: PollParams }>({
  pollParams: [defaultParams, { option: true }],
  pollPage: async ({ page, pollParams }, use) => {
    const pollPage = new PollPage(page);
    await pollPage.create(pollParams);
    await use(pollPage);
  },
});

const selectGame = async ({ page, name }) => {
  return page
    .getByRole('row')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Auswählen' })
    .click();
}

test.describe('Entering polls', () => {
  test('Enter poll', async ({ pollPage }) => {
    const { page } = pollPage;

    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('Georg');

    await page.getByRole('button', { name: 'Weiter' }).click();

    const [game] = boardgames;
    const shortGame = boardgames.find(it => it.short);

    await expect(page
      .getByRole('paragraph')
      .filter({ hasText: `Du kannst ${defaultParams.participants} Spiele auswählen` }))
      .toBeVisible();
    await expect(page.getByText(game.name)).toBeVisible();
    await expect(page.getByText(shortGame.name)).not.toBeVisible();

    await selectGame({ page, name: game.name });

    await expect(page.locator('.ranking').getByRole('row').filter({ hasText: game.name })).toBeVisible();

    await page.getByRole('button', { name: 'Auswählen' }).first().click();
    await page.getByRole('button', { name: 'Auswählen' }).first().click();
    await expect(page.getByRole('button', { name: 'Auswählen' }).first()).toBeDisabled();

    await page.getByRole('button', { name: 'x' }).first().click();
    await expect(page.getByRole('button', { name: 'Auswählen' }).first()).not.toBeDisabled();
    await expect(page
      .getByRole('paragraph')
      .filter({ hasText: `Du kannst noch 1 Spiel auswählen` }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Weiter' }).click();

    await expect(page.getByText(shortGame.name)).toBeVisible();
    await expect(page.getByText(game.name)).not.toBeVisible();

    await selectGame({ page, name: shortGame.name });

    await expect(page.locator('.ranking').getByRole('row').filter({ hasText: shortGame.name })).toBeVisible();

    await page.getByRole('button', { name: 'Auswählen' }).first().click();
    await page.getByRole('button', { name: 'Auswählen' }).first().click();
    await expect(page.getByRole('button', { name: 'Auswählen' }).first()).toBeDisabled();

    await page.getByRole('button', { name: 'x' }).first().click();
    await expect(page.getByRole('button', { name: 'Auswählen' }).first()).not.toBeDisabled();
    await expect(page
      .getByRole('paragraph')
      .filter({ hasText: `Du kannst noch 1 Spiel auswählen` }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Abschicken' }).click();

    await expect(page.getByRole('heading').filter({ hasText: 'Danke für deine Teilnahme!' })).toBeVisible();
  });
});

