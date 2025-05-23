const BasePage = require('../pages/BasePage.js');
const { By } = require('selenium-webdriver');

class LoginPage extends BasePage {
  get usernameInput() { return By.id('username'); }
  get passwordInput() { return By.id('password'); }
  get loginButton() { return By.css('button[type="submit"]'); }
  get errorMessage() { return By.css('.bg-red-100.border-red-500'); }
  get successMessage() { return By.css('.bg-green-100.border-green-500'); }
  get googleLoginButton() { return By.css('div[role="button"]'); }
  get forgotPasswordLink() { return By.css('button[onclick*="forgot-password"]'); }

  async login(username, password) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async isErrorMessageDisplayed() {
    return this.isDisplayed(this.errorMessage);
  }

  async isSuccessMessageDisplayed() {
    return this.isDisplayed(this.successMessage);
  }
}

module.exports = LoginPage;