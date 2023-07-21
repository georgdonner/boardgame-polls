import { test as base, expect } from '@playwright/test';

import boardgames from './data/boardgames.ts';
import type { PollParams } from './fixtures/poll-page.ts';
import { PollPage } from './fixtures/poll-page.ts';

const defaultParams: PollParams = {
  participants: 2,
  rankingSize: 3,
  rankingShortSize: 3,
};

const defaultGames = boardgames.filter(it => !it.short).slice(0, defaultParams.rankingSize);
const defaultShortGames = boardgames.filter(it => it.short).slice(0, defaultParams.rankingShortSize);

// Extend basic test by providing a "todoPage" fixture.
const test = base.extend<{ pollPage: PollPage, pollParams: PollParams }>({
  pollParams: [defaultParams, { option: true }],
  pollPage: async ({ page, pollParams }, use) => {
    const pollPage = new PollPage(page);
    await pollPage.create(pollParams);
    await use(pollPage);
    await page.goto('/');
  },
});

const selectGame = async ({ page, name }) => {
  return page
    .getByRole('row')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Auswählen' })
    .click();
}

// Very basic entering a poll without any expect checks, select first three games
const enterPoll = async ({ page, name }) => {
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill(name);
  await page.getByRole('button', { name: 'Weiter' }).click();

  for (const game of defaultGames) {
    await selectGame({ page, name: game.name });
  }
  await page.getByRole('button', { name: 'Weiter' }).click();

  for (const game of defaultShortGames) {
    await selectGame({ page, name: game.name });
  }
  await page.getByRole('button', { name: 'Abschicken' }).click();
}

test.describe('Entering polls', () => {
  test('Enter poll', async ({ pollPage }) => {
    const { page } = pollPage;

    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('Georg');

    await page.getByRole('button', { name: 'Weiter' }).click();


    const [game] = defaultGames;
    const [shortGame] = defaultShortGames;

    await expect(page
      .getByRole('paragraph')
      .filter({ hasText: `Du kannst ${defaultParams.rankingSize} Spiele auswählen` }))
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

    await expect(page
      .getByRole('heading')
      .filter({ hasText: 'Danke für deine Teilnahme!' }))
      .toBeVisible();
  });

  test('Show results when poll has finished', async ({ pollPage }) => {
    const { page } = pollPage;
    
    await enterPoll({ page, name: 'Georg' });
    
    await page.reload();

    await enterPoll({ page, name: 'Fritz' });

    await expect(page
      .getByRole('heading')
      .filter({ hasText: 'Die Ergebnisse der Umfrage sind da!' }))
      .toBeVisible();

    for (const game of defaultGames.concat(defaultShortGames)) {
      await expect(page
        .getByRole('heading')
        .filter({ hasText: game.name }))
        .toBeVisible();
    }
  });
});

