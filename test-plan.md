# Test Plan - External Search Widget Integration

## Test Scenarios Covered

### 1. **Host Page and Iframe Loading**
   - **Why**: Validates that the host page correctly embeds the widget iframe and that the iframe loads from the expected URL. This is foundational for all other tests.

### 2. **Valid Search with Results**
   - **Why**: Ensures the core functionality works - users can search and see results. Tests the happy path with a known valid search term ("playwright").

### 3. **Invalid Search (No Results)**
   - **Why**: Validates error handling and user feedback when no results are found. Critical for UX to show appropriate messaging.

### 4. **searchMetrics Message (Valid Search)**
   - **Why**: Verifies that the widget correctly communicates search metrics to the parent page, which is essential for analytics and integration tracking.

### 5. **searchMetrics Message (Invalid Search)**
   - **Why**: Ensures metrics are sent even when no results are found, maintaining consistent communication patterns.

### 6. **resultClick Message on Click**
   - **Why**: Validates that user interactions (clicking results) are properly communicated to the parent page, enabling tracking and navigation.

### 7. **Keyboard Accessibility (Enter Key)**
   - **Why**: Ensures the widget is accessible to keyboard users, meeting accessibility standards.

### 8. **postMessage Communication Verification**
   - **Why**: Confirms the bidirectional communication channel between host and iframe is established correctly.

## How to Run the Tests

### Setup
1. Clone the repository (if applicable)
2. Navigate to the `QA_Automation_Challenge` folder:
   ```bash
   cd QA_Automation_Challenge
   ```
   **Important**: All subsequent commands must be run from this directory.

### Prerequisites
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Start the servers (in separate terminals):
   **⚠️ Critical**: Both servers must be started from the `QA_Automation_Challenge` directory, otherwise the HTML files won't be found and tests will fail with 404 errors.
   
   ### Terminal 1 (from QA_Automation_Challenge directory)
   ```bash
   cd QA_Automation_Challenge
   npx http-server . -p 8000
   ```
   
   ### Terminal 2 (from QA_Automation_Challenge directory)
   ```bash
   cd QA_Automation_Challenge
   npx http-server . -p 8001
   ```
   

### Run all tests
npx playwright test

### Run tests in headed mode (see browser)
npx playwright test --headed

### Run a specific test file
npx playwright test tests/search.spec.ts

### Run tests with UI mode
npx playwright test --ui


## Known Assumptions and Limitations

1. **Server Dependencies**: Tests assume both HTTP servers (ports 8000 and 8001) are running before test execution. Tests will fail if servers are not available.

2. **Cross-Origin Setup**: Tests rely on the iframe being served from a different origin (port 8001) than the host (port 8000) to simulate real-world cross-origin scenarios.

3. **Message Capture Method**: Tests use `page.evaluate()` to capture `postMessage` events by storing them in a global `__testMessages` variable. This approach works but is less elegant than Playwright's native message interception.

4. **Mock Data Dependency**: Tests assume the widget's mock data contains "playwright" as a searchable term. Changes to mock data in `widget.html` may break tests.

5. **Timing**: Tests use `waitFor` and `waitForFunction` to handle async operations, but in high-latency environments, timeouts may need adjustment.

## Additional Tests (Given More Time)

### 1. **Edge Cases and Input Validation**
   - Test empty search query
   - Test special characters in search query
   - Test very long search strings
   - Test search with whitespace-only input

### 2. **Init Message Verification**
   - Verify that the host page's `init` message is received by the iframe
   - Test that the iframe responds correctly to different init payloads (theme variations)
   - Validate that init message is sent only once on page load

### 3. **Error Handling**
   - Test behavior when iframe fails to load
   - Test behavior when widget server is unavailable
   - Verify graceful degradation when postMessage fails
