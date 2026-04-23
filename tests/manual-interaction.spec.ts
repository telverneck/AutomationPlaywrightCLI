import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test.describe('Manual Interaction Test - Based on playwright-cli Demo', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await todoPage.reloadPage();
  });

  test.afterEach(async () => {
    // Cleanup after each test
    await todoPage.clearLocalStorage();
    await todoPage.getPage().close();
  });

  test('Add two todos and complete the first one', async () => {
    // Step 1: Add first todo "Buy gmilk"
    await todoPage.addTodo('Buy gmilk');
    
    // Verify first todo was added
    let todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(1);
    
    // Step 2: Add second todo "Water bottles"
    await todoPage.addTodo('Water bottles');
    
    // Verify both todos are present
    todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(2);
    
    // Verify todo texts
    const allTodos = await todoPage.getAllVisibleTodos();
    expect(allTodos).toContain('Buy gmilk');
    expect(allTodos).toContain('Water bottles');
    
    // Step 3: Check (complete) the first todo "Buy gmilk"
    await todoPage.completeTodo(0);
    
    // Verify first todo is marked as completed
    const isCompleted = await todoPage.isTodoCompleted(0);
    expect(isCompleted).toBe(true);
    
    // Verify completed count
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(1);
    
    // Verify item counter shows 1 active item
    const activeCount = await todoPage.getActiveTodoCount();
    expect(activeCount).toContain('1');
    
    // Step 4: Take screenshot
    await todoPage.takeScreenshot('test-results/screenshots/manual-interaction-demo.png');
  });

  test('Verify todos state after manual interactions', async () => {
    // Setup: Add and complete first todo
    await todoPage.addTodo('Buy gmilk');
    await todoPage.addTodo('Water bottles');
    await todoPage.completeTodo(0);
    
    // Verify state
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(2);
    
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(1);
    
    // Verify first todo text and completion status
    const firstTodoText = await todoPage.getTodoText(0);
    expect(firstTodoText).toContain('Buy gmilk');
    expect(await todoPage.isTodoCompleted(0)).toBe(true);
    
    // Verify second todo is not completed
    const secondTodoText = await todoPage.getTodoText(1);
    expect(secondTodoText).toContain('Water bottles');
    expect(await todoPage.isTodoCompleted(1)).toBe(false);
    
    await todoPage.takeScreenshot('test-results/screenshots/manual-interaction-verification.png');
  });

  test('Complete second todo and verify all states', async () => {
    // Setup: Add two todos with first one completed
    await todoPage.addTodo('Buy gmilk');
    await todoPage.addTodo('Water bottles');
    await todoPage.completeTodo(0);
    
    // Now complete the second todo
    await todoPage.completeTodo(1);
    
    // Verify both are completed
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(2);
    
    // Verify no active items left
    const activeCount = await todoPage.getActiveTodoCount();
    expect(activeCount).toContain('0');
    
    // Verify both todos are marked as completed
    expect(await todoPage.isTodoCompleted(0)).toBe(true);
    expect(await todoPage.isTodoCompleted(1)).toBe(true);
    
    await todoPage.takeScreenshot('test-results/screenshots/manual-interaction-all-completed.png');
  });

  test('Clear completed todos after manual interactions', async () => {
    // Setup: Add two todos and complete first one
    await todoPage.addTodo('Buy gmilk');
    await todoPage.addTodo('Water bottles');
    await todoPage.completeTodo(0);
    
    // Clear completed todos
    await todoPage.clearCompletedTodos();
    
    // Verify only the incomplete todo remains
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(1);
    
    // Verify remaining todo is "Water bottles"
    const remainingTodos = await todoPage.getAllVisibleTodos();
    expect(remainingTodos).toContain('Water bottles');
    expect(remainingTodos).not.toContain('Buy gmilk');
    
    await todoPage.takeScreenshot('test-results/screenshots/manual-interaction-cleared.png');
  });
});
