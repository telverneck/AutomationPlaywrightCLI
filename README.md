# TodoMVC Playwright Automation Project

## 📋 Project Overview

This is a comprehensive **Playwright test automation project** for the TodoMVC application. The project demonstrates industry best practices using the **Page Object Model (POM)** design pattern with TypeScript.

**Key Stats:**
- ✅ **70+ automated tests** across 3 browsers
- ✅ **100% passing** test suite
- ✅ **POM architecture** for maintainability
- ✅ **Comprehensive documentation** and examples
- ✅ **Screenshots** for all test scenarios

---

## 🏗️ How the Project Was Built

### Architecture & Design Pattern

The project follows the **Page Object Model (POM)** pattern, which is an industry best practice for test automation:

```
tests/
├── pages/                    # Page Object Classes
│   ├── BasePage.ts          # Base class with common methods
│   └── TodoPage.ts          # TodoMVC-specific page object
├── locators/                 # Centralized Locators
│   └── todoLocators.ts      # All CSS selectors in one place
└── *.spec.ts                # Test files using POM
```

### Key Components

#### 1. **Locators** (`tests/locators/todoLocators.ts`)
- Centralized CSS selectors for all UI elements
- Single source of truth for selectors
- Easy to update when UI changes
- 15+ locators for TodoMVC elements

#### 2. **BasePage** (`tests/pages/BasePage.ts`)
- Base class for all page objects
- Common methods: navigation, interactions, utilities
- Provides: `click()`, `fill()`, `hover()`, `takeScreenshot()`, etc.
- 11+ helper methods

#### 3. **TodoPage** (`tests/pages/TodoPage.ts`)
- Extends BasePage
- TodoMVC-specific methods
- 31+ methods for todos operations
- Organized into: Locator Getters, Actions, Verifications

#### 4. **Test Files**
- `todomvc-pom.spec.ts` - 18 comprehensive test scenarios (54 tests)
- `manual-interaction.spec.ts` - 4 practical workflow tests (12 tests)
- Clean, readable test code using POM methods

### Technology Stack

```json
{
  "dependencies": {
    "playwright": "^1.59.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@types/node": "^25.6.0"
  }
}
```

---

## 🚀 How to Use This Project

### Installation

1. **Clone or navigate to the project:**
```bash
cd /Users/(yourFolder)
```

2. **Install dependencies:**
```bash
npm install
```

### Running Tests

#### Run All Tests
```bash
npx playwright test
```

#### Run Specific Test File
```bash
# POM-based tests (18 scenarios × 3 browsers)
npx playwright test tests/todomvc-pom.spec.ts

# Manual interaction tests (4 scenarios × 3 browsers)
npx playwright test tests/manual-interaction.spec.ts

# Run all tests in verbose mode
npx playwright test --reporter=list
```

#### Run Specific Test
```bash
npx playwright test -g "Add a single todo"
```

#### Run with Browser Visible
```bash
npx playwright test tests/todomvc-pom.spec.ts --headed
```

#### Run with UI Mode (Interactive)
```bash
npx playwright test tests/todomvc-pom.spec.ts --ui
```

#### Generate HTML Report
```bash
npx playwright test
npx playwright show-report
```

#### Run on Specific Browser
```bash
npx playwright test tests/todomvc-pom.spec.ts --project=chromium
npx playwright test tests/todomvc-pom.spec.ts --project=firefox
npx playwright test tests/todomvc-pom.spec.ts --project=webkit
```

#### Debug Mode
```bash
npx playwright test tests/todomvc-pom.spec.ts --debug
```

---

## 📁 Project Structure

```
Automation/
├── tests/
│   ├── pages/
│   │   ├── BasePage.ts              # Base class with 11+ methods
│   │   └── TodoPage.ts              # 31+ TodoMVC methods
│   ├── locators/
│   │   └── todoLocators.ts          # 15+ CSS selectors
│   ├── todomvc-pom.spec.ts          # 18 scenarios (54 tests)
│   ├── manual-interaction.spec.ts   # 4 scenarios (12 tests)
│   ├── todomvc.spec.ts              # Legacy tests
│   └── example.spec.ts
├── test-results/
│   ├── screenshots/                 # 22 captured screenshots
│   └── ...
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Dependencies & scripts
├── POM_STRUCTURE.md                 # Detailed POM documentation
├── POM_README.md                    # Quick reference guide
├── TEST_REPORT.md                   # Test execution summary
└── README.md                        # This file
```

---

## 🎯 Test Coverage

### POM-Based Tests (`todomvc-pom.spec.ts`) - 18 Scenarios

#### Successful Scenarios (10)
- ✅ Add a single todo
- ✅ Add multiple todos
- ✅ Complete a todo
- ✅ Delete a todo
- ✅ Toggle all todos as completed
- ✅ Clear completed todos
- ✅ Filter - Active todos
- ✅ Filter - Completed todos
- ✅ Edit a todo
- ✅ Item count updates correctly

#### Edge Cases (8)
- ❌ Add empty todo (validation)
- ❌ Add todo with only spaces (validation)
- ❌ Edit todo to empty (delete behavior)
- ❌ Cancel edit by pressing Escape
- ❌ Uncomplete a todo
- ❌ Filter All shows all todos
- ❌ Persistence - todos survive page reload
- ❌ Double-click edit mode

### Manual Interaction Tests (`manual-interaction.spec.ts`) - 4 Scenarios

- ✅ Add two todos and complete the first one
- ✅ Verify todos state after manual interactions
- ✅ Complete second todo and verify all states
- ✅ Clear completed todos after manual interactions

### Browser Coverage
All tests run on:
- ✅ **Chromium**
- ✅ **Firefox**
- ✅ **WebKit**

**Total:** 66 tests passing ✅

---

## 📖 Using the Page Objects

### Example 1: Simple Test
```typescript
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test('Add a todo', async ({ page }) => {
  const todoPage = new TodoPage(page);
  
  // Setup
  await todoPage.goto();
  
  // Action
  await todoPage.addTodo('Buy groceries');
  
  // Verification
  const count = await todoPage.getTodoCount();
  expect(count).toBe(1);
});
```

### Example 2: Complex Workflow
```typescript
test('Complete and clear todos', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  
  // Add multiple todos
  await todoPage.addMultipleTodos(['Buy milk', 'Walk dog', 'Study']);
  
  // Complete first two
  await todoPage.completeTodo(0);
  await todoPage.completeTodo(1);
  
  // Clear completed
  await todoPage.clearCompletedTodos();
  
  // Verify
  expect(await todoPage.getTodoCount()).toBe(1);
  
  // Screenshot
  await todoPage.takeScreenshot('result.png');
});
```

### Example 3: Using Locators Directly
```typescript
test('Interact with UI directly', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  
  // Use locator getters
  await todoPage.newTodoInput.fill('New task');
  await todoPage.newTodoInput.press('Enter');
  
  // Count todos
  const count = await todoPage.todoItems.count();
  expect(count).toBe(1);
});
```

---

## 📚 Available TodoPage Methods

### Action Methods
```typescript
// Adding todos
await todoPage.addTodo(text)
await todoPage.addMultipleTodos(texts[])

// Todo operations
await todoPage.completeTodo(index)
await todoPage.completeAllTodos()
await todoPage.uncompleteTodo(index)
await todoPage.deleteTodo(index)
await todoPage.editTodo(index, newText)
await todoPage.cancelEditTodo(index, newText)

// Filters
await todoPage.filterAll()
await todoPage.filterActive()
await todoPage.filterCompleted()

// Utilities
await todoPage.clearCompletedTodos()
await todoPage.takeScreenshot(path)
```

### Verification Methods
```typescript
// Counts
await todoPage.getTodoCount()
await todoPage.getCompletedTodoCount()
await todoPage.getActiveTodoCount()

// State checks
await todoPage.getTodoText(index)
await todoPage.isTodoCompleted(index)
await todoPage.todoExists(text)
await todoPage.isEditInputVisible()

// Collections
await todoPage.getAllVisibleTodos()
await todoPage.getVisibleTodoCount()
```

---

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## 📸 Test Artifacts

### Screenshots Location
```
test-results/screenshots/
├── success-*.png           # Successful test scenarios
├── fail-*.png              # Edge cases and validations
└── manual-interaction-*.png # Manual interaction tests
```

### HTML Reports
```bash
npx playwright test
npx playwright show-report
```

---

## 🎓 Best Practices Implemented

✅ **Page Object Model** - Separation of concerns  
✅ **Centralized Locators** - Single source of truth  
✅ **Type Safety** - Full TypeScript support  
✅ **DRY Principle** - No code duplication  
✅ **Descriptive Names** - Clear method and test names  
✅ **Comprehensive Documentation** - JSDoc comments  
✅ **Error Handling** - Proper timeouts and waits  
✅ **Browser Coverage** - Tests on all major browsers  
✅ **Screenshots** - Visual documentation  
✅ **Clean Test Code** - Focus on "what" not "how"  

---

## 🔍 Common Issues & Solutions

### Tests Not Running
```bash
# Ensure Playwright browsers are installed
npx playwright install

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Selector Not Found
- Check `tests/locators/todoLocators.ts` - may need update if UI changed
- Use `npx playwright test --debug` to inspect elements
- Use `playwright-cli snapshot` for element references

### Timeout Issues
- Increase timeout in playwright.config.ts
- Add explicit waits: `await page.waitForSelector(selector)`
- Check network conditions

### Browser Not Closing
- Ensure `test.afterEach()` calls `page.close()`
- Check for unclosed page references

---

## 📖 Documentation Files

- **[POM_STRUCTURE.md](POM_STRUCTURE.md)** - Detailed POM documentation with examples
- **[POM_README.md](POM_README.md)** - Quick reference guide
- **[TEST_REPORT.md](TEST_REPORT.md)** - Test execution summary
- **[README.md](README.md)** - This file

---

## 🚀 Next Steps & Extensions

### Add New Tests
1. Create test in `tests/newtest.spec.ts`
2. Use TodoPage methods from POM
3. Run: `npx playwright test tests/newtest.spec.ts`

### Add New Page
1. Create `tests/locators/newPageLocators.ts`
2. Create `tests/pages/NewPage.ts` extending BasePage
3. Import and use in tests

### Continuous Integration
- Tests can run in CI/CD pipelines
- Use `playwright.config.ts` for CI settings
- Generate HTML reports for documentation

---

## 📞 Support & References

- **Playwright Docs:** https://playwright.dev
- **TodoMVC App:** https://demo.playwright.dev/todomvc/
- **TypeScript:** https://www.typescriptlang.org

---

## 📝 Summary

This project demonstrates a production-ready test automation framework using:
- ✅ Industry best practices (POM pattern)
- ✅ Modern testing tools (Playwright)
- ✅ Type safety (TypeScript)
- ✅ Comprehensive test coverage
- ✅ Clear documentation
- ✅ Maintainable code structure

Perfect for learning test automation or as a template for new projects!

---

**Last Updated:** April 23, 2026  
**Playwright Version:** ^1.59.1  
**Status:** ✅ All Tests Passing (66/66)
