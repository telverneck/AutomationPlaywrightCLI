/**
 * TodoMVC Locators
 * Centralized locator definitions for all TodoMVC UI elements
 */

export const TODO_LOCATORS = {
  // Input fields
  newTodoInput: '.new-todo',
  editTodoInput: '.todo-list li input.edit',

  // Todo list elements
  todoList: '.todo-list',
  todoItem: '.todo-list li',
  todoLabel: '.todo-list li label',
  todoCheckbox: '.todo-list li input[type="checkbox"]',
  todoDeleteButton: '.todo-list li .destroy',
  completedTodo: '.todo-list li.completed',

  // Buttons and controls
  toggleAllCheckbox: 'input.toggle-all',
  clearCompletedButton: 'button.clear-completed',

  // Counter and info
  todoCounter: '.todo-count strong',
  todoCount: '.todo-count',

  // Filters
  allFilter: 'a[href="#/"]',
  activeFilter: 'a[href="#/active"]',
  completedFilter: 'a[href="#/completed"]',

  // Footer
  footer: '.footer',
} as const;

export type TodoLocatorKey = keyof typeof TODO_LOCATORS;
