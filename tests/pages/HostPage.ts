import { Page, FrameLocator, expect, Locator } from '@playwright/test';

const HOST_URL = 'http://localhost:8000/host.html';
const WIDGET_URL = 'http://localhost:8001/widget.html';

export class HostPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly widgetFrame: Locator;
  readonly eventLog: Locator;
  readonly widget: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2');
    this.widgetFrame = page.locator('#widget-frame');
    this.eventLog = page.locator('#log');
    this.widget = page.frameLocator('#widget-frame');
  }

  async goto(): Promise<void> {
    await this.page.goto(HOST_URL);
    // Wait for the iframe to load
    await this.widget.locator('#query').waitFor({ state: 'visible' });
  }

  async verifyHostPageLoaded(): Promise<void> {
    await expect(this.heading).toContainText('Host App');
    await expect(this.widgetFrame).toBeVisible();
  }

  async verifyIframeSource(): Promise<void> {
    const iframeSrc = await this.widgetFrame.getAttribute('src');
    expect(iframeSrc).toBe(WIDGET_URL);
  }

  async verifyEventLogVisible(): Promise<void> {
    await expect(this.eventLog).toBeVisible();
    await expect(this.eventLog).toContainText('Waiting for messages');
  }

  async verifyEventLogContains(text: string): Promise<void> {
    await expect(this.eventLog).toContainText(text);
  }

  getWidget(): FrameLocator {
    return this.widget;
  }
}
