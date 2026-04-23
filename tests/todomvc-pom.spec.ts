import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test.describe('TodoMVC Application Tests - POM Pattern', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await todoPage.reloadPage();
  });

  // ============ SUCCESSFUL SCENARIOS ============

  test('Successful: Add a single todo', async () => {
    await todoPage.addTodo('Buy groceries');
    
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(1);
    
    const todoText = await todoPage.getTodoText(0);
    expect(todoText).toContain('Buy groceries');
    
    await todoPage.takeScreenshot('test-results/screenshots/success-add-todo.png');
  });

  test('Successful: Add multiple todos', async () => {
    const todos = ['Buy groceries', 'Walk the dog', 'Complete project'];
    await todoPage.addMultipleTodos(todos);
    
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(3);
    
    const allTodos = await todoPage.getAllVisibleTodos();
    expect(allTodos).toEqual(todos);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-multiple-todos.png');
  });

  test('Successful: Complete a todo', async () => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.completeTodo(0);
    
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(1);
    
    const isCompleted = await todoPage.isTodoCompleted(0);
    expect(isCompleted).toBe(true);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-complete-todo.png');
  });

  test('Successful: Delete a todo', async () => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.deleteTodo(0);
    
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(0);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-delete-todo.png');
  });

  test('Successful: Toggle all todos as completed', async () => {
    const todos = ['Buy groceries', 'Walk the dog', 'Complete project'];
    await todoPage.addMultipleTodos(todos);
    
    await todoPage.completeAllTodos();
    
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(3);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-toggle-all.png');
  });

  test('Successful: Clear completed todos', async () => {
    const todos = ['Buy groceries', 'Walk the dog', 'Complete project'];
    await todoPage.addMultipleTodos(todos);
    
    // Complete first two todos
    await todoPage.completeTodo(0);
    await todoPage.completeTodo(1);
    
    await todoPage.clearCompletedTodos();
    
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(1);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-clear-completed.png');
  });

  test('Successful: Filter - Active todos', async () => {
    const todos = ['Buy groceries', 'Walk the dog', 'Complete project'];
    await todoPage.addMultipleTodos(todos);
    
    // Complete first todo
    await todoPage.completeTodo(0);
    
    // Apply active filter
    await todoPage.filterActive();
    
    // Verify we can still interact with the page
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBeGreaterThan(0);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-filter-active.png');
  });

  test('Successful: Filter - Completed todos', async () => {
    const todos = ['Buy groceries', 'Walk the dog', 'Complete project'];
    await todoPage.addMultipleTodos(todos);
    
    // Complete first two todos
    await todoPage.completeTodo(0);
    await todoPage.completeTodo(1);
    
    // Apply completed filter
    await todoPage.filterCompleted();
    
    // Verify we can still interact with the page
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBeGreaterThan(0);
    
    // Verify completed todos exist
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(2);
    
    await todoPage.takeScreenshot('test-results/screenshots/success-filter-completed.png');
  });

  test('Successful: Edit a todo', async () => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.editTodo(0, 'Buy organic groceries');
    
    const todoText = await todoPage.getTodoText(0);
    expect(todoText).toContain('Buy organic groceries');
    
    await todoPage.takeScreenshot('test-results/screenshots/success-edit-todo.png');
  });

  test('Successful: Item count updates correctly', async () => {
    const todos = ['Task 1', 'Task 2', 'Task 3'];
    await todoPage.addMultipleTodos(todos);
    
    // Check counter shows 3 items
    let activeCount = await todoPage.getActiveTodoCount();
    expect(activeCount).toContain('3');
    
    // Complete one and check counter shows 2
    await todoPage.completeTodo(0);
    activeCount = await todoPage.getActiveTodoCount();
    expect(activeCount).toContain('2');
    
    await todoPage.takeScreenshot('test-results/screenshots/success-item-counter.png');
  });

  // ============ FAILING/EDGE CASE SCENARIOS ============

  test('Failing: Add empty todo (should not add)', async () => {
    // Try to add an empty todo
    await todoPage.addTodo('');
    
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(0);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-empty-todo.png');
  });

  test('Failing: Add todo with only spaces (should not add)', async () => {
    // Try to add a todo with only spaces
    await todoPage.addTodo('   ');
    
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(0);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-spaces-only-todo.png');
  });

  test('Failing: Edit todo to empty (deletes the todo)', async () => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.editTodo(0, '');
    
    // Todo should be deleted when saved as empty
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(0);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-edit-empty.png');
  });

  test('Failing: Cancel edit by pressing Escape', async () => {
    await todoPage.addTodo('Buy groceries');
    
    // Try to edit but cancel with Escape
    await todoPage.cancelEditTodo(0, 'Buy organic groceries');
    
    // Todo should keep original text
    const todoText = await todoPage.getTodoText(0);
    expect(todoText).toContain('Buy groceries');
    expect(todoText).not.toContain('Buy organic groceries');
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-edit-cancel.png');
  });

  test('Failing: Uncomplete a todo', async () => {
    await todoPage.addTodo('Buy groceries');
    
    // Complete the todo
    await todoPage.completeTodo(0);
    let completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(1);
    
    // Uncomplete the todo
    await todoPage.uncompleteTodo(0);
    completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(0);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-uncomplete-todo.png');
  });

  test('Failing: Filter All shows all todos', async () => {
    const todos = ['Task 1', 'Task 2', 'Task 3'];
    await todoPage.addMultipleTodos(todos);
    
    // Complete some todos
    await todoPage.completeTodo(0);
    await todoPage.completeTodo(2);
    
    // Click All filter
    await todoPage.filterAll();
    
    // All todos should still be there
    const allTodos = await todoPage.getAllVisibleTodos();
    expect(allTodos.length).toBe(3);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-filter-all.png');
  });

  test('Failing: Persistence - todos survive page reload', async () => {
    const todos = ['Buy groceries', 'Walk the dog'];
    await todoPage.addMultipleTodos(todos);
    
    // Complete one todo
    await todoPage.completeTodo(0);
    
    // Reload the page
    await todoPage.reloadPage();
    
    // Todos should still be there
    const todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(2);
    
    const completedCount = await todoPage.getCompletedTodoCount();
    expect(completedCount).toBe(1);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-persistence-reload.png');
  });

  test('Failing: Double-click edit mode', async () => {
    await todoPage.addTodo('Buy groceries');
    
    // Double-click to enter edit mode
    await todoPage.getPage().locator('.todo-list li label').first().dblclick();
    
    // Edit input should be visible
    const isVisible = await todoPage.isEditInputVisible();
    expect(isVisible).toBe(true);
    
    await todoPage.takeScreenshot('test-results/screenshots/fail-double-click-edit.png');
  });
});
