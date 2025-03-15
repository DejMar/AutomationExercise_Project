# Automation Exercise Website Testing Project

This project contains automated end-to-end tests for the Automation Exercise demo website (https://www.automationexercise.com) using Playwright with TypeScript.

## Project Overview

The test suite provides comprehensive test coverage for an e-commerce website, implementing best practices in test automation including:

- Page Object Model design pattern
- Data-driven testing approach
- Screenshot capture on test failures
- Detailed test logging and reporting
- Reusable test steps and utilities

## Test Cases Coverage

### Contact Form Testing (TC06)
- Validates contact form submission with file upload
- Verifies success messages and form visibility
- Tests form field validations

### Product Management (TC08, TC09)
- Verifies product listing and detail pages
- Tests product search functionality with different keywords
- Validates product information display
- Checks review section functionality

### Shopping Cart Operations (TC12, TC13)
- Tests adding multiple products to cart
- Verifies cart contents and product quantities
- Validates price calculations
- Tests quantity adjustment features

### Subscription Features (TC10, TC11)
- Tests newsletter subscription on home page
- Validates subscription on cart page
- Verifies success messages
- Tests email validation

### Complete Order Flow (TC14)
- End-to-end order placement testing
- New user registration during checkout
- Address and payment information validation
- Order confirmation verification

## Technical Implementation

### Key Components
- **Page Objects**: Modular page classes (ProductPage.ts, CartPage.ts, etc.)
- **Shared Utilities**: Common functions for screenshots, logging
- **Test Data Generation**: Dynamic user and product data creation
- **Configuration**: Playwright config with browser and environment settings

### Testing Framework
- Playwright for browser automation
- TypeScript for type-safe code
- Parallel test execution capability
- Cross-browser testing support

## Project Setup
The project uses Playwright's built-in test runner and supports:
- Multiple browser testing (Chrome, Firefox, Safari)
- Configurable base URL and timeouts
- Screenshot and trace capture

## Test Execution
Tests can be run in parallel with retry capability on failures. The framework includes:
- Before/After hooks for test setup and cleanup
- Failure screenshots and logging
- Detailed test step reporting
- Environment-specific configurations


## API Testing
The test suite includes comprehensive API testing to validate backend functionality:

### API Test Coverage
- Authentication endpoints for login/signup
- Product catalog and search APIs 
- Cart and order management endpoints
- User profile and account operations

### API Testing Approach
- Request validation for different HTTP methods (GET, POST, PUT, DELETE)
- Response schema validation
- Error handling and edge cases
- Authentication token management
- Data consistency checks

### Key API Test Features
- **Automated Assertions**: Validates response codes, headers and payloads
- **Data Driven Testing**: Uses test data files for different scenarios
- **Integration Tests**: Validates API integrations and data flow
- **Performance Checks**: Basic response time validation

### API Test Implementation
- Uses Playwright's API testing capabilities
- Custom request helpers and utilities
- Shared test data and configurations
- Detailed API test reportings