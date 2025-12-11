# QA Automation Challenge — External Iframe (Playwright)

## Overview
You are given a small demo app consisting of:
- **`host.html`** — a parent app embedding an external iframe
- **`widget.html`** — a mock external search widget that behaves like a lightweight “Google Search SDK”

Your task is to **write Playwright automated tests** that validate the integration between the parent and the iframe and produce a short test plan (`test-plan.md`).

You have **up to 2 hours** to complete this challenge.

---

## Objectives

- Verify that the host page can communicate with the iframe via `window.postMessage`.
- Validate that the iframe correctly displays search results and “no results” states.
- Assert that clicking a result in the iframe sends a `resultClick` message to the parent.
- Check that the widget is keyboard accessible (Enter key triggers result click).
- Demonstrate correct use of Playwright’s `frame()` API and handling of cross-origin iframes.

---

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm init -y
   npm install @playwright/test
   ```

2. **Serve both files (simulate different origins)**

   ```bash
   # Terminal 1
   npx http-server host -p 8000

   # Terminal 2
   npx http-server widget -p 8001
   ```

3. **Verify manually**
   - Open [http://localhost:8000/host.html](http://localhost:8000/host.html)
   - The iframe loads from [http://localhost:8001/widget.html](http://localhost:8001/widget.html)
   - Try searching “playwright” — results should appear and messages should log below the iframe.

---

## Your Tasks

1. **Automated Tests**
   - Write Playwright tests that:
     - Interact with the iframe (`page.frame()` or `frameLocator`).
     - Perform a valid search (`"playwright"`) and assert results.
     - Perform an invalid search (e.g., `"xyz"`) and assert “no results” message and `searchMetrics` event.
     - Capture and assert `postMessage` events (`resultClick`, `searchMetrics`).
     - Validate keyboard accessibility (focus + Enter on result).
   - Include reusable helpers or fixtures if needed.

2. **Test Plan**
   - Create a short `test-plan.md` (max 1 page) describing:
     - What scenarios are covered and why
     - How to run the tests
     - Known assumptions or limitations
     - 3 additional tests you would add with more time

3. **Optional Enhancements**
   - Record console logs or captured messages for debugging.
   - Use Playwright’s reporter or video recording to showcase test runs.

---

## Run Instructions (expected from your submission)

```bash
npx playwright test
```

Tests should:
- Launch the host page on `http://localhost:8000/host.html`
- Interact with the iframe at `http://localhost:8001/widget.html`
- Validate message exchange and UI states

---

## Deliverables

Submit a compressed folder or GitHub repo containing:

```
/tests/
  search.spec.ts
/test-plan.md
/package.json
/playwright.config.ts (optional)
```

Optionally include a short `README` with steps to run your solution.

---

## Evaluation Criteria

| Category | Description | Weight |
|-----------|--------------|--------|
| **Technical depth** | Correct use of Playwright, frame handling, message interception | 50% |
| **Code quality** | Clean, maintainable, deterministic tests | 20% |
| **QA thinking** | Test coverage, prioritization, edge cases | 15% |
| **Documentation** | Clarity of test plan and setup instructions | 15% |

---

## Notes
- The widget simulates an **external third-party SDK**.  
  Cross-origin access is limited — use Playwright’s `frame()` API and `postMessage` interception instead of direct DOM traversal.
- Keep tests stable and fast; use `waitForSelector` or event waits rather than `setTimeout`.

---

## Estimated Time
**~90–120 minutes total**

Good luck, and focus on clarity, correctness, and good QA automation discipline.

