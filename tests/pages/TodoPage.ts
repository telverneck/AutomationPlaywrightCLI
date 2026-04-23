import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TODO_LOCATORS } from '../locators/todoLocators';

/**
 * TodoMVC Page Object
 * Encapsulates all interactions with the TodoMVC application
 */
export class TodoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ============ LOCATOR GETTERS ============

  get newTodoInput(): Locator {
    return this.page.locator(TODO_LOCATORS.newTodoInput);
  }

  get todoList(): Locator {
    return this.page.locator(TODO_LOCATORS.todoList);
  }

  get todoItems(): Locator {
    return this.page.locator(TODO_LOCATORS.todoItem);
  }

  get todoLabels(): Locator {
    return this.page.locator(TODO_LOCATORS.todoLabel);
  }

  get todoCheckboxes(): Locator {
    return this.page.locator(TODO_LOCATORS.todoCheckbox);
  }

  get completedTodos(): Locator {
    return this.page.locator(TODO_LOCATORS.completedTodo);
  }

  get toggleAllCheckbox(): Locator {
    return this.page.locator(TODO_LOCATORS.toggleAllCheckbox);
  }

  get clearCompletedButton(): Locator {
    return this.page.locator(TODO_LOCATORS.clearCompletedButton);
  }

  get todoCounter(): Locator {
    return this.page.locator(TODO_LOCATORS.todoCounter);
  }

  get allFilter(): Locator {
    return this.page.locator(TODO_LOCATORS.allFilter);
  }

  get activeFilter(): Locator {
    return this.page.locator(TODO_LOCATORS.activeFilter);
  }

  get completedFilter(): Locator {
    return this.page.locator(TODO_LOCATORS.completedFilter);
  }

  // ============ ACTIONS ============

  /**
   * Add a new todo
   */
  async addTodo(todoText: string): Promise<void> {
    await this.newTodoInput.fill(todoText);
    await this.newTodoInput.press('Enter');
  }

  /**
   * Add multiple todos
   */
  async addMultipleTodos(todos: string[]): Promise<void> {
    for (const todo of todos) {
      await this.addTodo(todo);
    }
  }

  /**
   * Complete a todo by index
   */
  async completeTodo(index: number): Promise<void> {
    await this.todoCheckboxes.nth(index).click();
  }

  /**
   * Complete all todos
   */
  async completeAllTodos(): Promise<void> {
    await this.toggleAllCheckbox.click();
  }

  /**
   * Uncomplete a todo by index
   */
  async uncompleteTodo(index: number): Promise<void> {
    await this.todoCheckboxes.nth(index).click();
  }

  /**
   * Delete a todo by index
   */
  async deleteTodo(index: number): Promise<void> {
    await this.todoItems.nth(index).hover();
    const deleteButton = this.page.locator(TODO_LOCATORS.todoDeleteButton).nth(index);
    await deleteButton.click();
  }

  /**
   * Edit a todo by index
   */
  async editTodo(index: number, newText: string): Promise<void> {
    await this.todoLabels.nth(index).dblclick();
    const editInput = this.page.locator(TODO_LOCATORS.editTodoInput);
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Cancel editing a todo using Escape
   */
  async cancelEditTodo(index: number, newText: string): Promise<void> {
    await this.todoLabels.nth(index).dblclick();
    const editInput = this.page.locator(TODO_LOCATORS.editTodoInput);
    await editInput.fill(newText);
    await editInput.press('Escape');
  }

  /**
   * Clear all completed todos
   */
  async clearCompletedTodos(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  /**
   * Click All filter
   */
  async filterAll(): Promise<void> {
    await this.allFilter.click();
  }

  /**
   * Click Active filter
   */
  async filterActive(): Promise<void> {
    await this.activeFilter.click();
  }

  /**
   * Click Completed filter
   */
  async filterCompleted(): Promise<void> {
    await this.completedFilter.click();
  }

  // ============ ASSERTIONS/VERIFICATIONS ============

  /**
   * Get total todo count
   */
  async getTodoCount(): Promise<number> {
    return this.todoItems.count();
  }

  /**
   * Get completed todo count
   */
  async getCompletedTodoCount(): Promise<number> {
    return this.completedTodos.count();
  }

  /**
   * Get active todo count (from counter)
   */
  async getActiveTodoCount(): Promise<string | null> {
    return this.todoCounter.textContent();
  }

  /**
   * Get todo text by index
   */
  async getTodoText(index: number): Promise<string | null> {
    return this.todoLabels.nth(index).textContent();
  }

  /**
   * Check if todo exists by text
   */
  async todoExists(text: string): Promise<boolean> {
    return (await this.page.locator(`text="${text}"`).count()) > 0;
  }

  /**
   * Check if todo is completed by index
   */
  async isTodoCompleted(index: number): Promise<boolean> {
    const classAttr = await this.todoItems.nth(index).getAttribute('class');
    return classAttr?.includes('completed') || false;
  }

  /**
   * Get all visible todo texts
   */
  async getAllVisibleTodos(): Promise<string[]> {
    const visibleItems = this.page.locator(TODO_LOCATORS.todoItem + ':visible');
    const count = await visibleItems.count();
    const todos: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const label = visibleItems.nth(i).locator('label');
      const text = await label.textContent();
      if (text) todos.push(text);
    }
    return todos;
  }

  /**
   * Check if edit input is visible
   */
  async isEditInputVisible(): Promise<boolean> {
    return this.isElementVisible(TODO_LOCATORS.editTodoInput);
  }

  /**
   * Check if clear completed button is visible
   */
  async isClearCompletedVisible(): Promise<boolean> {
    return this.isElementVisible(TODO_LOCATORS.clearCompletedButton);
  }

  /**
   * Get visible todo items count
   */
  async getVisibleTodoCount(): Promise<number> {
    return this.page.locator(TODO_LOCATORS.todoItem).count();
  }
}
