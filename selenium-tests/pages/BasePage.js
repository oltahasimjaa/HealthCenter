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

async selectDropdownByText(selectBy, visibleText) {
  const select = await this.find(selectBy);
  const options = await select.findElements(By.tagName('option'));

  for (const option of options) {
    const text = await option.getText();
    console.log('Dropdown option:', text);  // Add this to debug
    if (text.trim() === visibleText) {
      await option.click();
      return;
    }
  }

  throw new Error(`Option "${visibleText}" not found in dropdown`);
}
async selectFirstDropdownOption(selectBy) {
  const select = await this.find(selectBy);
  const options = await select.findElements(By.tagName('option'));
  if (options.length > 1) {  // skip placeholder
    await options[1].click();  // select the first non-placeholder option
  } else if (options.length > 0) {
    await options[0].click();  // fallback to first
  } else {
    throw new Error("No options available in dropdown");
  }
}


  // Add this:
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
async find(locator) {
  return await this.driver.findElement(locator);
}

async findAll(locator) {
  return await this.driver.findElements(locator);
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