import { FrameLocator, expect, Locator } from '@playwright/test';

export class WidgetPage {
  readonly frame: FrameLocator;
  readonly heading: Locator;
  readonly queryInput: Locator;
  readonly searchButton: Locator;
  readonly resultsContainer: Locator;
  readonly resultItems: Locator;
  readonly noResultsMessage: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.heading = frame.locator('h3');
    this.queryInput = frame.locator('#query');
    this.searchButton = frame.locator('#searchBtn');
    this.resultsContainer = frame.locator('#results');
    this.resultItems = frame.locator('.result-item');
    this.noResultsMessage = frame.locator('.no-results');
  }

  async verifyWidgetLoaded(): Promise<void> {
    await expect(this.heading).toContainText('External Search Widget');
    await expect(this.queryInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async search(query: string): Promise<void> {
    await this.queryInput.clear();
    await this.queryInput.fill(query);
    await this.searchButton.click();
  }

  async waitForResults(): Promise<void> {
    await this.resultsContainer.waitFor({ state: 'visible' });
  }

  async verifyResultsDisplayed(expectedText: string): Promise<void> {
    await expect(this.resultItems).toBeVisible();
    await expect(this.resultItems).toContainText(expectedText);
  }

  async verifyNoResultsMessage(): Promise<void> {
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsMessage).toContainText('No results found');
  }

  async verifyNoResultItems(): Promise<void> {
    await expect(this.resultItems).toHaveCount(0);
  }

  async clickFirstResult(): Promise<void> {
    await this.resultItems.first().click();
  }

  async focusFirstResult(): Promise<void> {
    await this.resultItems.first().focus();
  }

  async pressEnterOnFirstResult(): Promise<void> {
    await this.resultItems.first().press('Enter');
  }
}
