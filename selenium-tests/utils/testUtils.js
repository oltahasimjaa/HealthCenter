const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function createDriver() {
  let options = new chrome.Options();
  
  if (process.env.CI === 'true' || config.headless) {
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
  }

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

function generateTestEmail() {
  return `test${Date.now()}@example.com`;
}

function generateTestUsername() {
  return `testuser${Date.now()}`;
}

module.exports = {
  createDriver,
  generateTestEmail,
  generateTestUsername
};