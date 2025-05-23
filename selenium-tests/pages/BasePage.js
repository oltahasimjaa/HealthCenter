const { Builder, By, until } = require('selenium-webdriver');
const config = require('../config/config');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(path = '') {
    await this.driver.get(`${config.baseUrl}${path}`);
    return this;
  }

  async findElement(locator) {
    await this.driver.wait(until.elementLocated(locator), config.timeout);
    return this.driver.findElement(locator);
  }

  async waitForElement(locator) {
    return this.driver.wait(until.elementLocated(locator), config.timeout);
  }

  async getText(locator) {
    const element = await this.findElement(locator);
    return element.getText();
  }

  async click(locator) {
    const element = await this.findElement(locator);
    await element.click();
  }

  async type(locator, text) {
    const element = await this.findElement(locator);
    await element.clear();
    await element.sendKeys(text);
  }
// Select dropdown by visible text
async selectDropdown(locator, value) {
    if (!value) return; // Skip if empty value
    
    const dropdown = await this.driver.findElement(locator);
    await dropdown.click();
    
    // Wait for options to be visible
    await this.driver.sleep(500);
    
    try {
        // Try CSS selector first
        const option = await this.driver.findElement(By.css(`option[value="${value}"], option[text="${value}"]`));
        await option.click();
    } catch (e) {
        // Fallback to XPath if CSS fails
        try {
            const option = await this.driver.findElement(By.xpath(`//option[contains(text(), "${value}") or @value="${value}"]`));
            await option.click();
        } catch (e) {
            throw new Error(`Option "${value}" not found in dropdown. Available options: ${await dropdown.getText()}`);
        }
    }
}

// Get visible text from an element
async getElementText(locator) {
  const element = await this.findElement(locator);
  return await element.getText();
}
  async isDisplayed(locator) {
    try {
      const element = await this.findElement(locator);
      return await element.isDisplayed();
    } catch (e) {
      return false;
    }
  }
}

module.exports = BasePage;