# Automation Exercise Testing Framework

This framework enables robust end-to-end and API testing for the Automation Exercise demo website ([automationexercise.com](https://www.automationexercise.com)), employing Playwright with TypeScript and modern automation standards.

## What This Framework Can Do

- 🚀 **Automate UI Flows:** Test every major user journey (registration, login, shop, cart, checkout, contact, scroll, subscription, and more)
- 🛠️ **Reusable Page Object Model:** Encapsulates all selectors and UI actions in structured classes for maintainability and scalability
- 🔄 **Data-Driven Testing:** Easily swap or randomize test data (users, products, addresses, etc.) for flexible scenario coverage
- 🖼️ **Automatic Failure Evidence:** Captures screenshots and test step logs on any error for easier debugging
- 🧩 **Detailed Custom Logging & Reporting:** Each test step is logged and results can be exported or enriched with metadata
- 📊 **Comprehensive Test Report Generation:** After running all tests, an interactive HTML report is automatically generated to visualize results, view step details, error traces, and screenshots in one place.
- 🔥 **Parallel & Cross-Browser Execution:** Tests run in parallel on Chrome, Firefox, Safari, Edge, and support multiple devices/viewports
- 🧪 **Robust API Validation:** Built-in utilities for validating backend endpoints with schema checks, payload assertions, and authentication flows
- 🏗️ **Modular Utilities:** Shared helpers for tasks like random data generation, file uploads, session cleanup, and retry logic
- 🌎 **Flexible Configuration:** Easily set base URLs, environments, credentials, and other settings per test run or CI environment
- 📦 **CI/CD Ready:** Out-of-the-box support for GitHub Actions, GitLab CI, Jenkins, etc.

## Feature Coverage

### UI Test Capabilities

- **Contact Form (TC06):** Submit with/without file upload, assert responses, negative (validation) checks
- **Home Page & Navigation (TC18, TC19):** Validate categories/brands, ensure navigation and filter accuracy, check page titles
- **Product Management (TC08, TC09):** Validate catalog, product details, search, review submission and verification
- **Shopping Cart (TC12, TC13):** Run scenarios for adding/removing multiple items, quantity control, price calculations, persistent cart sessions
- **Subscription (TC10, TC11):** Subscribe from multiple sections, validate success/failure alerts, email input validation
- **Checkout & Ordering (TC14):** End-to-end flow including new user registration, address form fill, payment, and order confirmation checks
- **Scroll Testing (TC25, TC26):** Test all scroll-based UI features (arrows/buttons/manual), check element visibility after scroll
- **Robust Validation:** For all major UI elements, forms, popups, error states, and edge cases

### API Testing Features

- **Endpoint Coverage:** Login/signup, product catalog/search/filters, cart actions, order submission, user profile, and more
- **Request Versatility:** Test GET, POST, PUT, DELETE with varying payloads and headers
- **Authentication & Token Handling:** Automate login/token retrieval and session validation scenarios
- **Response Validation:** Assert HTTP status codes, payload shapes, error messages, data consistency
- **Performance Checks:** Basic SLAs on response time and data loading
- **Integrated with Test Data:** API and UI tests share dynamic data—test complete front-to-back flows

## Technical Stack & Implementation

- **Playwright with TypeScript:** Ensures strong typing and reliable browser automation
- **Page Object Pattern:** ProductPage, CartPage, ContactUsPage, etc., for readable and maintainable code
- **Shared Utilities:** For screenshots, step logging, API helpers, and random data generation (via Faker.js)
- **Configurable Playwright Runner:** Multi-browser/device support, trace collection, flexible retries and timeouts
- **Hooks for Setup/Teardown:** Initialize/cleanup test data and session states before/after each test
- **Error Handling:** Automatic trace and screenshot capture for every failing step
- **Test Reporting & Reports:** Detailed step-level logs for each test. After the full suite runs, a unified HTML report is created—view it locally or share with your team for easy review of test outcomes, errors, and evidence.

## How to Run

- Run tests in parallel and across browsers with `npx playwright test`
- Configure environments, base URLs, credentials via `playwright.config.js` or environment variables
- Execute specific suites or tests by tag, name, or path
- **After running all tests, open the generated HTML report using `npx playwright show-report` to review full results, logs, and screenshots**
- View HTML reports, screenshots, and log exports after each run

## Extensibility

- **Add New Pages/Features:** Just create a new Page Object and extend data/util libraries
- **API Endpoints:** Easily add or modify endpoint tests using provided helpers
- **Test Data:** Plug in more generators or static data files as needed
- **CI/CD Integration:** Ready-to-use for continuous testing pipelines
- **Custom Reporting:** Enrich logs or export to custom dashboards/analytics

---

**In summary:**  
This framework provides a unified, maintainable, and scalable approach for automated UI and backend testing. After each run, a detailed HTML report is generated, making it easy to review all test results, errors, and debugging evidence. The framework is suitable for complex e-commerce applications, enabling fast feedback, clear reporting, and easy expansion to new requirements.