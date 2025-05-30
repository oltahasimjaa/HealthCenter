const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const UserProgramsPage = require('../pages/UserProgramsPage');
const LoginPage = require('../pages/LoginPage');
const config = require('../config/config');

describe('User Programs Page End-to-End Test Flow', function () {
  this.timeout(40000);
  let driver;
  let userProgramsPage;
  let loginPage;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    userProgramsPage = new UserProgramsPage(driver);
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('should log in and navigate to user programs page', async () => {
    await driver.get(config.baseUrl + '/login');
    
    // Wait for login elements
    const usernameInput = await driver.wait(until.elementLocated(loginPage.usernameInput), 5000);
    await driver.wait(until.elementIsVisible(usernameInput), 5000);
    await driver.wait(until.elementIsEnabled(usernameInput), 5000);

    const passwordInput = await driver.wait(until.elementLocated(loginPage.passwordInput), 5000);
    await driver.wait(until.elementIsVisible(passwordInput), 5000);
    await driver.wait(until.elementIsEnabled(passwordInput), 5000);

    const loginButton = await driver.wait(until.elementLocated(loginPage.loginButton), 5000);
    await driver.wait(until.elementIsVisible(loginButton), 5000);
    await driver.wait(until.elementIsEnabled(loginButton), 5000);

    // Perform login
    await loginPage.login('owner', 'owner');

    // Wait for redirect
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url === `${config.baseUrl}/` || url.includes('/dashboard');
    }, 10000);

    // Navigate to user programs page
    await driver.get(config.baseUrl + '/dashboard/userprograms');

    // Wait for user select to appear
    await driver.wait(until.elementLocated(userProgramsPage.userSelect), 5000);
  });

it('should create a new user program association', async () => {
  // Wait for user dropdown
  const userDropdown = await driver.wait(until.elementLocated(userProgramsPage.userSelect), 7000);
  await driver.wait(until.elementIsVisible(userDropdown), 5000);
  await driver.wait(until.elementIsEnabled(userDropdown), 5000);

 
  // Select only user option
  await userProgramsPage.selectFirstDropdownOption(userProgramsPage.userSelect);

 

  // Submit
  await userProgramsPage.click(userProgramsPage.submitButton);

  // Wait for result (better if you assert change instead of sleep)
  await driver.sleep(2000);
});


  it('should delete a user program association', async () => {
    // Click first delete button
    const deleteButtons = await driver.findElements(userProgramsPage.deleteButtons);
    if (deleteButtons.length === 0) throw new Error("No user programs to delete");
    await deleteButtons[0].click();
    
    // Wait for deletion to complete
    await driver.sleep(2000); // temporary wait
  });
});