# Page Object Model (POM) - Quick Reference

## Project Structure

```
Automation/
├── tests/
│   ├── pages/                          # Page Object classes
│   │   ├── BasePage.ts                # Common functionality for all pages
│   │   └── TodoPage.ts                # TodoMVC page object with methods & locators
│   ├── locators/                       # Centralized locators
│   │   └── todoLocators.ts            # All CSS selectors for TodoMVC
│   ├── todomvc-pom.spec.ts            # ✅ NEW: Tests using POM (54 tests)
│   └── todomvc.spec.ts                # Original tests (legacy reference)
├── POM_STRUCTURE.md                    # Detailed POM documentation
└── README.md                           # This file
```

## Key Files Created

### 1. **Locators** (`tests/locators/todoLocators.ts`)
Centralized all CSS selectors in one place:
```typescript
export const TODO_LOCATORS = {
  newTodoInput: '.new-todo',
  todoItem: '.todo-list li',
  todoCheckbox: '.todo-list li input[type="checkbox"]',
  // ... more selectors
};
```

### 2. **Base Page** (`tests/pages/BasePage.ts`)
Provides common methods for all page objects:
- Navigation: `goto()`, `reloadPage()`
- Interactions: `click()`, `fillInput()`, `doubleClick()`
- Utilities: `takeScreenshot()`, `clearLocalStorage()`

### 3. **Todo Page** (`tests/pages/TodoPage.ts`)
Page object specific to TodoMVC with:

**Locator Getters:**
```typescript
get newTodoInput(): Locator { }
get todoItems(): Locator { }
get completedTodos(): Locator { }
```

**Action Methods:**
```typescript
async addTodo(text: string)
async completeTodo(index: number)
async deleteTodo(index: number)
async editTodo(index: number, newText: string)
async filterActive()
async filterCompleted()
// ... more methods
```

**Verification Methods:**
```typescript
async getTodoCount(): Promise<number>
async getCompletedTodoCount(): Promise<number>
async isTodoCompleted(index: number): Promise<boolean>
async getAllVisibleTodos(): Promise<string[]>
// ... more methods
```

### 4. **POM Tests** (`tests/todomvc-pom.spec.ts`)
Clean, maintainable tests using the page object:
```typescript
test('Add a todo', async () => {
  await todoPage.addTodo('Buy groceries');
  const count = await todoPage.getTodoCount();
  expect(count).toBe(1);
});
```

## Running Tests

```bash
# Run all POM tests
npx playwright test tests/todomvc-pom.spec.ts

# Run specific test
npx playwright test tests/todomvc-pom.spec.ts -g "Add a todo"

# Run with UI mode
npx playwright test tests/todomvc-pom.spec.ts --ui

# Run with headed browser
npx playwright test tests/todomvc-pom.spec.ts --headed

# Generate HTML report
npx playwright test tests/todomvc-pom.spec.ts && npx playwright show-report
```

## Test Coverage

✅ **18 Unique Test Scenarios** × 3 Browsers = **54 Total Tests**

### Successful Scenarios (10)
- Add single/multiple todos
- Complete and uncomplete todos  
- Delete todos
- Edit todos
- Toggle all todos
- Clear completed todos
- Filter by Active/Completed/All
- Item counter accuracy

### Edge Cases (8)
- Empty todo validation
- Whitespace validation
- Edit cancellation
- Edit to empty (delete behavior)
- State persistence
- Edit mode activation

## Benefits of This POM Structure

✅ **Maintainability** - Selectors in one place  
✅ **Reusability** - Methods can be used across tests  
✅ **Readability** - Tests focus on "what" not "how"  
✅ **Scalability** - Easy to add new pages and methods  
✅ **DRY Principle** - No duplication of interactions  
✅ **Type Safety** - Full TypeScript support  

## How to Extend

### Add a New Page Object

1. Create locators file: `tests/locators/newPageLocators.ts`
2. Create page class: `tests/pages/NewPage.ts`
3. Extend `BasePage` and add methods

```typescript
// tests/pages/NewPage.ts
import { BasePage } from './BasePage';
import { NEW_PAGE_LOCATORS } from '../locators/newPageLocators';

export class NewPage extends BasePage {
  get button(): Locator {
    return this.page.locator(NEW_PAGE_LOCATORS.button);
  }
  
  async clickButton(): Promise<void> {
    await this.button.click();
  }
}
```

### Add a New Method to TodoPage

```typescript
export class TodoPage extends BasePage {
  async myNewMethod(): Promise<void> {
    // Implementation
  }
}
```

## Screenshots

All test screenshots are saved to:
```
test-results/screenshots/
├── success-*.png        # Successful test scenarios
└── fail-*.png           # Edge cases and validations
```

## Documentation

- See `POM_STRUCTURE.md` for detailed documentation
- See `TEST_REPORT.md` for test execution summary

## Test Status

- ✅ **54/54 tests passing**
- ✅ **All 3 browsers tested** (Chromium, Firefox, WebKit)
- ✅ **All screenshots captured**
- ✅ **POM pattern fully implemented**
