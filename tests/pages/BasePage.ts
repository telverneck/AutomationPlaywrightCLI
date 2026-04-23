import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page class for all page objects
 * Provides common functionality and helper methods
 */
export class BasePage {
  protected page: Page;
  readonly baseURL: string = 'https://demo.playwright.dev/todomvc/';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get the Playwright page object
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Navigate to the application
   */
  async goto(): Promise<void> {
    await this.page.goto(this.baseURL);
  }

  /**
   * Get a locator by selector
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Fill an input field
   */
  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  /**
   * Click an element
   */
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Double click an element
   */
  async doubleClick(selector: string): Promise<void> {
    await this.page.dblclick(selector);
  }

  /**
   * Hover over an element
   */
  async hover(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  /**
   * Press a key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.press('body', key);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear localStorage (for test cleanup)
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Reload the page
   */
  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(filepath: string): Promise<void> {
    await this.page.screenshot({ path: filepath, fullPage: true });
  }

  /**
   * Get text content of an element
   */
  async getTextContent(selector: string): Promise<string | null> {
    return this.page.locator(selector).textContent();
  }

  /**
   * Get count of elements
   */
  async getElementCount(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }
}
