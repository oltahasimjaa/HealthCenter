const { Builder, until, By } = require('selenium-webdriver');


const { expect } = require('chai');
const LoginPage = require('../pages/LoginPage');
const config = require('../config/config');
const BasePage = require('../pages/BasePage');
describe('Login Functionality', function() {
  let driver;
  let loginPage;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    loginPage = new LoginPage(driver);
  });

  after(async function() {
    await driver.quit();
  });

  it('should display login form', async function() {
    await loginPage.open('/login');
    const isFormDisplayed = await loginPage.isDisplayed(loginPage.loginButton);
    expect(isFormDisplayed).to.be.true;
  });

it('should login successfully with valid credentials and logout', async function() {
  const driver = loginPage.driver;

  // Wait and interact with login elements as before
  const usernameInput = await driver.wait(until.elementLocated(loginPage.usernameInput), 5000);
  await driver.wait(until.elementIsVisible(usernameInput), 5000);
  await driver.wait(until.elementIsEnabled(usernameInput), 5000);

  const passwordInput = await driver.wait(until.elementLocated(loginPage.passwordInput), 5000);
  await driver.wait(until.elementIsVisible(passwordInput), 5000);
  await driver.wait(until.elementIsEnabled(passwordInput), 5000);

  const loginButton = await driver.wait(until.elementLocated(loginPage.loginButton), 5000);
  await driver.wait(until.elementIsVisible(loginButton), 5000);
  await driver.wait(until.elementIsEnabled(loginButton), 5000);

  // Enter valid credentials
  await usernameInput.sendKeys('no1');
  await passwordInput.sendKeys('fddb7b8b8524d1a3');
  await loginButton.click();

  // Wait for redirect to '/'
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    return currentUrl === `${config.baseUrl}/`;
  }, 10000);

  const finalUrl = await driver.getCurrentUrl();
  expect(finalUrl).to.equal(`${config.baseUrl}/`);

  const logoutButton = await driver.wait(until.elementLocated(By.css('button[data-testid="logout-button"]')), 10000);
  await driver.wait(until.elementIsVisible(logoutButton), 5000);
  await driver.wait(until.elementIsEnabled(logoutButton), 5000);
  await logoutButton.click();

  // Wait for redirect to login page after logout
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return url.includes('/login');
  }, 10000); 
});



  it('should show error with invalid credentials', async function() {
    await loginPage.open('/login');
    await loginPage.login('invalid', 'invalid');
    const isError = await loginPage.isErrorMessageDisplayed();
    expect(isError).to.be.true;
  });

  it('should redirect to forgot password after 3 failed attempts', async function() {
    await loginPage.open('/login');
    
    // Perform 3 failed login attempts
    for (let i = 0; i < 3; i++) {
      await loginPage.login('invalid', 'invalid');
    }
    
    // Wait for redirect
    await driver.sleep(2000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/forgot-password');
  });



  it('should have working Google login button', async function() {
    await loginPage.open('/login');
    const isGoogleBtnDisplayed = await loginPage.isDisplayed(loginPage.googleLoginButton);
    expect(isGoogleBtnDisplayed).to.be.true;
  });

});