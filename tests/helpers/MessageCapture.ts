import { Page } from '@playwright/test';

export interface MessageData {
  type: string;
  [key: string]: unknown;
}

export interface CapturedMessage {
  type: string;
  data: MessageData;
  timestamp: string;
}

export class MessageCapture {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async setup(): Promise<void> {
    await this.page.evaluate(() => {
      (window as any).__testMessages = [];
      window.addEventListener('message', (event: any) => {
        if (event.origin === 'http://localhost:8001') {
          const messageData: CapturedMessage = {
            type: event.data?.type || 'unknown',
            data: event.data,
            timestamp: new Date().toISOString()
          };
          (window as any).__testMessages.push(messageData);
          console.log('Captured postMessage:', messageData);
        }
      });
    });
  }

  async waitForMessageType(messageType: string, timeout?: number): Promise<void> {
    await this.page.waitForFunction(
      (msgType) => {
        const messages = (window as any).__testMessages || [];
        return messages.some((m: CapturedMessage) => m.type === msgType);
      },
      messageType,
      { timeout }
    );
  }

  async getMessages(): Promise<CapturedMessage[]> {
    return await this.page.evaluate(() => (window as any).__testMessages || []);
  }

  async getMessageByType(messageType: string): Promise<CapturedMessage | undefined> {
    const messages = await this.getMessages();
    return messages.find((m) => m.type === messageType);
  }
}
