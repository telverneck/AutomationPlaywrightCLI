# Page Object Model (POM) Structure

## Overview
This project uses the **Page Object Model** design pattern to organize and maintain test automation code. POM improves maintainability, reusability, and scalability of test suites.

## Directory Structure

```
tests/
├── pages/                          # Page Object classes
│   ├── BasePage.ts                # Base class with common functionality
│   └── TodoPage.ts                # TodoMVC page object
├── locators/                       # Centralized locator definitions
│   └── todoLocators.ts            # All selectors for TodoMVC
├── todomvc-pom.spec.ts            # Test file using POM
└── todomvc.spec.ts                # Original test file (legacy)
```

## Key Components

### 1. Locators (`locators/todoLocators.ts`)
Centralized storage for all CSS selectors and locators.

**Benefits:**
- Single source of truth for all selectors
- Easy to update selectors when UI changes
- Reduces duplication across tests
- Improves maintainability

**Example:**
```typescript
export const TODO_LOCATORS = {
  newTodoInput: '.new-todo',
  todoList: '.todo-list',
  todoItem: '.todo-list li',
  // ... more locators
};
```

### 2. BasePage (`pages/BasePage.ts`)
Base class containing common methods used by all page objects.

**Provides:**
- Navigation (`goto()`, `reloadPage()`)
- Element interactions (`click()`, `fill()`, `hover()`)
- Waits and visibility checks
- Screenshot capture
- LocalStorage management

**Example:**
```typescript
export class BasePage {
  async goto(): Promise<void>
  async click(selector: string): Promise<void>
  async fillInput(selector: string, text: string): Promise<void>
  // ... more methods
}
```

### 3. TodoPage (`pages/TodoPage.ts`)
Page object specific to TodoMVC application.

**Extends:** `BasePage`

**Contains:**
- **Locator Getters:** Properties that return Playwright Locators
- **Actions:** User interaction methods (addTodo, completeTodo, etc.)
- **Verifications:** Methods to check state and retrieve data

**Example:**
```typescript
export class TodoPage extends BasePage {
  get newTodoInput(): Locator {
    return this.page.locator(TODO_LOCATORS.newTodoInput);
  }

  async addTodo(todoText: string): Promise<void> {
    await this.newTodoInput.fill(todoText);
    await this.newTodoInput.press('Enter');
  }

  async getTodoCount(): Promise<number> {
    return this.todoItems.count();
  }
}
```

### 4. Test File (`todomvc-pom.spec.ts`)
Clean test file using POM pattern.

**Benefits:**
- Highly readable test code
- Focuses on "what" not "how"
- Maintainable and DRY principle
- Easy to extend

**Example:**
```typescript
test('Successful: Add a todo', async () => {
  await todoPage.addTodo('Buy groceries');
  
  const todoCount = await todoPage.getTodoCount();
  expect(todoCount).toBe(1);
});
```

## Available TodoPage Methods

### Actions
- `addTodo(text: string)` - Add a new todo
- `addMultipleTodos(todos: string[])` - Add multiple todos
- `completeTodo(index: number)` - Mark todo as complete
- `completeAllTodos()` - Complete all todos
- `uncompleteTodo(index: number)` - Mark todo as incomplete
- `deleteTodo(index: number)` - Delete a todo
- `editTodo(index: number, newText: string)` - Edit todo text
- `cancelEditTodo(index: number, newText: string)` - Cancel edit with Escape
- `clearCompletedTodos()` - Remove all completed todos
- `filterAll()` - Show all todos
- `filterActive()` - Show active todos
- `filterCompleted()` - Show completed todos

### Verifications
- `getTodoCount()` - Get total todo count
- `getCompletedTodoCount()` - Get completed todos count
- `getActiveTodoCount()` - Get active todos count
- `getTodoText(index: number)` - Get todo text by index
- `todoExists(text: string)` - Check if todo exists
- `isTodoCompleted(index: number)` - Check if todo is completed
- `getAllVisibleTodos()` - Get all visible todo texts
- `isEditInputVisible()` - Check if edit mode is active
- `getVisibleTodoCount()` - Get count of visible todos

## Usage Example

```typescript
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test('Add and complete a todo', async ({ page }) => {
  const todoPage = new TodoPage(page);
  
  // Setup
  await todoPage.goto();
  await todoPage.clearLocalStorage();
  
  // Action
  await todoPage.addTodo('Buy groceries');
  await todoPage.completeTodo(0);
  
  // Verification
  const completedCount = await todoPage.getCompletedTodoCount();
  expect(completedCount).toBe(1);
  
  // Screenshot
  await todoPage.takeScreenshot('results.png');
});
```

## Running Tests

```bash
# Run all POM tests
npx playwright test tests/todomvc-pom.spec.ts

# Run specific test
npx playwright test tests/todomvc-pom.spec.ts -g "Add a todo"

# Run with UI
npx playwright test tests/todomvc-pom.spec.ts --ui

# Run with headed browser
npx playwright test tests/todomvc-pom.spec.ts --headed
```

## Best Practices

1. **Keep pages focused** - One page object per page/application section
2. **Use descriptive method names** - Methods should clearly indicate what they do
3. **Separate actions from verifications** - Actions change state, verifications check it
4. **Use locators centrally** - All selectors in `locators/` folder
5. **Extend BasePage** - Inherit common functionality instead of duplicating
6. **Type-safe** - Use TypeScript for better IDE support and error catching
7. **Document complex methods** - Add JSDoc comments for clarity

## Adding New Pages

To add a new page object:

1. Create locators file: `tests/locators/newPageLocators.ts`
2. Create page class: `tests/pages/NewPage.ts` extending `BasePage`
3. Import and use in tests

Example:
```typescript
// tests/locators/newPageLocators.ts
export const NEW_PAGE_LOCATORS = {
  button: '.my-button',
  input: '.my-input',
};

// tests/pages/NewPage.ts
export class NewPage extends BasePage {
  get button(): Locator {
    return this.page.locator(NEW_PAGE_LOCATORS.button);
  }
  
  async clickButton(): Promise<void> {
    await this.button.click();
  }
}
```

## Maintenance

- Update selectors in `locators/` when UI changes
- Add new methods to page objects as needed
- Keep tests DRY by using page object methods
- Regular review for unused locators or methods
