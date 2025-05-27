const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const ListPage = require('../pages/ListPage');
const LoginPage = require('../pages/LoginPage');
const config = require('../config/config');

describe('List Page End-to-End Test Flow', function () {
  this.timeout(40000);
  let driver;
  let listPage;
  let loginPage;

  const testListName = 'Test List';
  const updatedListName = 'Updated List';

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    listPage = new ListPage(driver);
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    await driver.quit();
  });

it('should log in and navigate to list page', async () => {
  // Navigate to login page
  await driver.get(config.baseUrl + '/login');

  // Wait for username input
  const usernameInput = await driver.wait(until.elementLocated(loginPage.usernameInput), 5000);
  await driver.wait(until.elementIsVisible(usernameInput), 5000);
  await driver.wait(until.elementIsEnabled(usernameInput), 5000);

  const passwordInput = await driver.wait(until.elementLocated(loginPage.passwordInput), 5000);
  await driver.wait(until.elementIsVisible(passwordInput), 5000);
  await driver.wait(until.elementIsEnabled(passwordInput), 5000);

  const loginButton = await driver.wait(until.elementLocated(loginPage.loginButton), 5000);
  await driver.wait(until.elementIsVisible(loginButton), 5000);
  await driver.wait(until.elementIsEnabled(loginButton), 5000);

  // Perform login using your page method
  await loginPage.login('owner', 'owner');

  // Wait for redirect to homepage or dashboard
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return url === `${config.baseUrl}/` || url.includes('/dashboard');
  }, 10000);

  // Navigate to list page
  await driver.get(config.baseUrl + '/dashboard/list');

  // Wait for name input to appear on the list page
  await driver.wait(until.elementLocated(listPage.nameInput), 5000);
});
it('should create a new list item', async () => {
  // Use testListName as name and provide a program title
  await listPage.createListItem(testListName, "Default Program");
  const names = await listPage.getAllListNames();
  console.log('Current list items:', names); // Debug output
  assert(names.includes(testListName));
});

  it('should delete the first list item', async () => {
    await listPage.deleteFirstListItem();
    const names = await listPage.getAllListNames();
    assert(!names.includes(updatedListName));
  });
});
