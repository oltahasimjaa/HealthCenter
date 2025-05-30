const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const ProgramPage = require('../pages/ProgramPage');
const LoginPage = require('../pages/LoginPage');
const config = require('../config/config');

describe('Program Page End-to-End Test Flow', function () {
  this.timeout(50000); // Rritje për siguri
  let driver;
  let programPage;
  let loginPage;

  const now = Date.now();

  const testProgram = {
    title: `Program Test ${now}`,
    description: 'Përshkrim testues për programin',
    updatedTitle: `Program i Përditësuar ${now}`,
    updatedDescription: 'Përshkrim i përditësuar',
  };

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    programPage = new ProgramPage(driver);
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('should log in as owner and navigate to Program', async () => {
    await driver.get(config.baseUrl + '/login');

    // Wait for login fields to be available and visible
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

    // Wait until redirect is complete
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url === `${config.baseUrl}/` || url.includes('/dashboard/program');
    }, 10000);

    // 🔽 Modal dismiss logic starts here
    try {
      const modal = await driver.wait(
        until.elementLocated(By.css('.modal, .modal-dialog, .change-password-modal')),
        5000
      );

      const cancelButton = await modal.findElement(By.xpath('.//button[contains(text(), "Cancel") or contains(text(), "Close")]'));
      await cancelButton.click();

      await driver.wait(until.stalenessOf(modal), 5000);
      console.log('Change Password modal closed successfully.');
    } catch (err) {
      console.log('No Change Password modal appeared — continuing.');
    }
    // 🔼 Modal dismiss logic ends here

    // Navigate to list page
    await driver.get(config.baseUrl + '/dashboard/program');

    // Wait for name input to appear on the list page
    await driver.wait(until.elementLocated(programPage.titleInput), 100000);
  });

  it('should create a new program', async () => {
    await programPage.createProgram(testProgram.title, testProgram.description);
    const titles = await programPage.getAllProgramTitles();
    assert(titles.includes(testProgram.title));
  });

  it('should update the first program', async () => {
    await programPage.editFirstProgram(testProgram.updatedTitle, testProgram.updatedDescription);
    const titles = await programPage.getAllProgramTitles();
    assert(titles.includes(testProgram.updatedTitle));
  });
});
