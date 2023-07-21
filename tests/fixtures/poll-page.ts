import type { Page, Locator } from '@playwright/test';

export interface PollParams {
  participants: number;
  rankingSize: number;
  rankingShortSize: number;
}

export class PollPage {
  private readonly participantsInput: Locator;
  private readonly rankingSizeInput: Locator;
  private readonly rankingShortSizeInput: Locator;

  constructor(public readonly page: Page) {
    this.participantsInput = this.page.locator('input[name="participants"]');
    this.rankingSizeInput = this.page.locator('input[name="rankingSize"]');
    this.rankingShortSizeInput = this.page.locator('input[name="rankingShortSize"]');
  }

  async create(pollParams: PollParams) {
    await this.page.goto('/');

    await this.page.getByRole('textbox').click();
    await this.page.getByRole('textbox').fill('Umfrage am Freitag 12.2.');

    await this.participantsInput.click();
    await this.participantsInput.fill(String(pollParams.participants));

    await this.rankingSizeInput.click();
    await this.rankingSizeInput.fill(String(pollParams.rankingSize));

    await this.rankingShortSizeInput.click();
    await this.rankingShortSizeInput.fill(String(pollParams.rankingShortSize));

    await this.page.getByRole('button', { name: 'Umfrage erstellen' }).click();

    await this.page.getByRole('button', { name: 'Zur Umfrage' }).click();
  }
}