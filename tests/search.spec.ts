import { test, expect } from '@playwright/test';
import { HostPage } from './pages/HostPage';
import { WidgetPage } from './pages/WidgetPage';
import { MessageCapture } from './helpers/MessageCapture';

test.describe('External Search Widget Integration', () => {
  let hostPage: HostPage;
  let widgetPage: WidgetPage;
  let messageCapture: MessageCapture;
  let consoleLogs: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Clear console logs for each test
    consoleLogs = [];

    // Capture console logs
    page.on('console', msg => {
      const logMessage = `${msg.type()}: ${msg.text()}`;
      consoleLogs.push(logMessage);
      console.log(`[Browser Console] ${logMessage}`);
    });

    // Capture page errors
    page.on('pageerror', error => {
      consoleLogs.push(`ERROR: ${error.message}`);
      console.error(`[Page Error] ${error.message}`);
    });

    // Initialize page objects
    hostPage = new HostPage(page);
    widgetPage = new WidgetPage(hostPage.getWidget());
    messageCapture = new MessageCapture(page);

    // Navigate to host page
    await hostPage.goto();
  });

  test('should load the host page with embedded iframe', async () => {
    await hostPage.verifyHostPageLoaded();
    await hostPage.verifyIframeSource();
    await widgetPage.verifyWidgetLoaded();

    // Log captured console messages for debugging
    if (consoleLogs.length > 0) {
      console.log('Console logs captured:', consoleLogs);
    }
  });

  test('should perform valid search and display results', async () => {
    await widgetPage.search('playwright');
    await widgetPage.waitForResults();
    await widgetPage.verifyResultsDisplayed('Playwright Testing Framework');
    await expect(widgetPage.noResultsMessage).not.toBeVisible();
  });

  test('should send searchMetrics message after valid search', async () => {
    await messageCapture.setup();
    await widgetPage.search('playwright');
    await messageCapture.waitForMessageType('searchMetrics');

    const searchMetricsMessage = await messageCapture.getMessageByType('searchMetrics');
    expect(searchMetricsMessage).toBeDefined();
    if (searchMetricsMessage) {
      expect(searchMetricsMessage.data).toMatchObject({
        type: 'searchMetrics',
        totalResults: 1,
        query: 'playwright'
      });
    }

    // Log all captured messages for debugging
    const messages = await messageCapture.getMessages();
    console.log('All captured messages:', JSON.stringify(messages, null, 2));

    // Also verify it appears in the log on the page
    await hostPage.verifyEventLogContains('searchMetrics');
  });

  test('should perform invalid search and display no results message', async () => {
    await widgetPage.search('xyz');
    await widgetPage.verifyNoResultsMessage();
    await widgetPage.verifyNoResultItems();
  });

  test('should send searchMetrics message with zero results for invalid search', async () => {
    await messageCapture.setup();
    await widgetPage.search('xyz');
    await messageCapture.waitForMessageType('searchMetrics', 5000);

    const searchMetricsMessage = await messageCapture.getMessageByType('searchMetrics');
    expect(searchMetricsMessage).toBeDefined();
    if (searchMetricsMessage) {
      expect(searchMetricsMessage.data).toMatchObject({
        type: 'searchMetrics',
        totalResults: 0,
        query: 'xyz'
      });
    }

    // Log captured messages for debugging
    const messages = await messageCapture.getMessages();
    console.log('Captured messages for invalid search:', JSON.stringify(messages, null, 2));
  });

  test('should send resultClick message when clicking a result', async () => {
    await widgetPage.search('playwright');
    await widgetPage.verifyResultsDisplayed('Playwright Testing Framework');
    await messageCapture.setup();
    await widgetPage.clickFirstResult();
    await messageCapture.waitForMessageType('resultClick');

    const resultClickMessage = await messageCapture.getMessageByType('resultClick');
    expect(resultClickMessage).toBeDefined();
    if (resultClickMessage) {
      expect(resultClickMessage.data).toMatchObject({
        type: 'resultClick',
        id: 1
      });
    }

    // Log captured messages for debugging
    const messages = await messageCapture.getMessages();
    console.log('Captured messages after click:', JSON.stringify(messages, null, 2));

    // Verify it appears in the log
    await hostPage.verifyEventLogContains('resultClick');
  });

  test('should be keyboard accessible - Enter key triggers result click', async () => {
    await widgetPage.search('playwright');
    await widgetPage.verifyResultsDisplayed('Playwright Testing Framework');
    await messageCapture.setup();
    await widgetPage.focusFirstResult();
    await widgetPage.pressEnterOnFirstResult();
    await messageCapture.waitForMessageType('resultClick');

    const resultClickMessage = await messageCapture.getMessageByType('resultClick');
    expect(resultClickMessage).toBeDefined();
    if (resultClickMessage) {
      expect(resultClickMessage.data).toMatchObject({
        type: 'resultClick',
        id: 1
      });
    }

    // Log captured messages for debugging
    const messages = await messageCapture.getMessages();
    console.log('Captured messages after Enter key:', JSON.stringify(messages, null, 2));
  });

  test('should handle postMessage communication between host and iframe', async () => {
    await widgetPage.verifyWidgetLoaded();
    await hostPage.verifyEventLogVisible();

    // Log console messages to verify init message was logged
    if (consoleLogs.length > 0) {
      console.log('Console logs (should include init message):', consoleLogs);
    }
  });
});

