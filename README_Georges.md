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