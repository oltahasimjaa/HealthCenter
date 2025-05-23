const BasePage = require('./BasePage');
const { By, until } = require('selenium-webdriver');

class RegisterPage extends BasePage {
  // Basic Information
  get nameInput() { return By.id('name'); }
  get lastNameInput() { return By.id('lastName'); }
  get numberInput() { return By.id('number'); }
  get emailInput() { return By.id('email'); }
  get usernameInput() { return By.id('username'); }
  
  // Personal Details
  get genderSelect() { return By.id('gender'); }
  get birthdayInput() { return By.id('birthday'); }
  
  // Location
  get countrySelect() { return By.name('country'); }
  get citySelect() { return By.name('city'); }
  
  // Form Actions
  get registerButton() { return By.css('button[type="submit"]'); }
  
  get successMessage() { return By.xpath('//h1[contains(text(), "Registration Successful!")]'); }
  
get errorMessage() { 
  return By.xpath('//*[contains(@class, "text-red-500") or contains(text(), "taken") or contains(text(), "exists") or contains(text(), "not available")]'); 
}


  // Improved validation message locators
  get usernameValidation() { 
    return By.xpath('//input[@id="username"]/following-sibling::p[contains(@class, "text-red-500") or contains(@class, "text-green-500")]');
  }

  get emailValidation() {
    return By.xpath('//input[@id="email"]/following-sibling::p[contains(@class, "text-red-500")]');
  }

  async fillRegistrationForm(userData) {
    await this.type(this.nameInput, userData.name);
    await this.type(this.lastNameInput, userData.lastName);
    await this.type(this.numberInput, userData.number);
    await this.type(this.emailInput, userData.email);
    await this.type(this.usernameInput, userData.username);
    
    // Select gender
    await this.selectDropdown(this.genderSelect, userData.gender);
    
    // Set birthday - handle date input format
    const birthdayInput = await this.driver.findElement(this.birthdayInput);
    await birthdayInput.clear();
    await birthdayInput.sendKeys(userData.birthday); // Format: YYYY-MM-DD
    
    // Select country and city
   if (userData.country) {
      await this.selectDropdown(this.countrySelect, userData.country);
      await this.driver.sleep(1000); // Wait for cities to load
    }
    if (userData.city) {
      await this.selectDropdown(this.citySelect, userData.city);
    }
  }

  async submitRegistration() {
    await this.click(this.registerButton);
  }

  async isRegistrationSuccessful() {
    try {
      // Wait for either success message or URL change
      await this.driver.wait(async () => {
        const currentUrl = await this.driver.getCurrentUrl();
        if (!currentUrl.includes('/register')) {
          return true;
        }
        try {
          return await this.driver.findElement(this.successMessage).isDisplayed();
        } catch (e) {
          return false;
        }
      }, 15000);
      return true;
    } catch (e) {
      return false;
    }
  }
  async getUsernameValidationMessage() {
    try {
      const element = await this.driver.wait(until.elementLocated(this.usernameValidation), 5000);
      return await element.getText();
    } catch (e) {
      return '';
    }
  }
  
  async getEmailValidationMessage() {
    try {
      const element = await this.driver.wait(until.elementLocated(this.emailValidation), 5000);
      return await element.getText();
    } catch (e) {
      return '';
    }
  }
async getErrorMessage() {
  try {
    await this.driver.wait(until.elementLocated(this.errorMessage), 10000);
    const element = await this.driver.findElement(this.errorMessage);
    return await element.getText();
  } catch (e) {
    // If no error element found, check for validation messages
    const usernameError = await this.getUsernameValidationMessage();
    return usernameError || 'No error message found';
  }
}
}

module.exports = RegisterPage;