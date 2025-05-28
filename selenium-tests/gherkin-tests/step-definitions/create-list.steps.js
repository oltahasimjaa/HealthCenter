const { Given, When, Then } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

let driver;
const LoginPage = require('../../pages/LoginPage');
const ListPage = require('../../pages/ListPage');

Given('përdoruesi është i kyçur', { timeout: 20000 }, async function () {
  driver = await new Builder().forBrowser('chrome').build();
  const loginPage = new LoginPage(driver);

  await driver.get('http://localhost:3001/login');
  await loginPage.login('owner', 'owner');

  // PRET që URL të ndryshojë pas login-it
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return url === 'http://localhost:3001/' || url.includes('/dashboard');
  }, 10000);

  // Tani je i kyçur – shko te dashboard/list
  await driver.get('http://localhost:3001/dashboard/list');
});
When('ai plotëson emrin me {string} dhe klikon "Shto"', async function (listName) {
  this.listPage = new ListPage(driver);
  await this.listPage.createListItem(listName, "Default Program");
});

Then('duhet të shfaqet lista me emrin {string}', async function (expectedName) {
  await driver.wait(async () => {
    const items = await driver.findElements(By.css('tbody tr td:first-child'));
    const texts = await Promise.all(items.map(item => item.getText()));
    console.log("Listat e shfaqura në UI:", texts);
    return texts.some(text => text.includes(expectedName));
  }, 10000, 'Lista me emrin e dhënë nuk u shfaq brenda 10 sekondave');

  await driver.quit();
});
