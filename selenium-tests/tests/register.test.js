const { Builder, By, until } = require('selenium-webdriver'); // Added By here
const { expect } = require('chai');
const RegisterPage = require('../pages/RegisterPage');

describe('Register Functionality', function() {
  let driver;
  let registerPage;

  // Helper function to format dates in YYYY-MM-DD format (for date input)
  function getBirthdate(years) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  before(async function() {
    this.timeout(20000);
    driver = await new Builder().forBrowser('chrome').build();
    registerPage = new RegisterPage(driver);
  });

  after(async function() {
    await driver.quit();
  });

  it('should display registration form', async function() {
    await registerPage.open('/register');
    const isFormDisplayed = await registerPage.isDisplayed(registerPage.registerButton);
    expect(isFormDisplayed).to.be.true;
  });


it('should show validation waiting message but not send passcode for invalid email', async function() {
  this.timeout(40000);

  await registerPage.open('/register');

  const testUser = {
    name: 'Test',
    lastName: 'User',
    number: '1234567890',
    email: 'invalid@kfjsdok.com', // purposely invalid
    username: `testuser${Date.now()}`,
    gender: 'Male',
    birthday: '01-01-2015',
    country: 'Kosovo',
    city: 'Prishtina'
  };

  await registerPage.fillRegistrationForm(testUser);
  await registerPage.submitRegistration();

const message = await registerPage.getErrorMessage();

expect(
  message.toLowerCase()
).to.match(
  /please wait while we validate your information|username.*taken|already exists/i
);
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include('/register');

  // Check passcode input does not exist
  const passcodeFields = await driver.findElements(By.css('#passcode-input'));
  expect(passcodeFields.length).to.equal(0);
});

  it('should reject birthday outside allowed range (too young)', async function() {
    this.timeout(20000);
    await registerPage.open('/register');
    
    const testUser = {
      name: 'Test',
      lastName: 'User',
      number: '1234567890',
      email: `test${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      gender: 'Male',
      birthday: '01-01-2021', // Too young
      country: 'Kosovo',
      city: 'Prishtina'
    };

    await registerPage.fillRegistrationForm(testUser);
    await registerPage.submitRegistration();
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  it('should show error for existing username', async function() {
    this.timeout(30000);
    await registerPage.open('/register');
    
    // First register a test user
    const username = `existinguser${Date.now()}`;
    const testUser = {
      name: 'Test',
      lastName: 'User',
      number: '1234567890',
      email: `test${Date.now()}@example.com`,
      username: 'owner',
      gender: 'Male',
      birthday: getBirthdate(30),
      country: 'Kosovo',
      city: 'Prishtina'
    };
    
    await registerPage.fillRegistrationForm(testUser);
    await registerPage.submitRegistration();
    await driver.sleep(2000);
    
    // Try to register same username again
    await registerPage.open('/register');
    testUser.email = `test${Date.now()}@example.com`;
    await registerPage.fillRegistrationForm(testUser);
    await registerPage.submitRegistration();
    
    const errorMessage = await registerPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).to.match(/username.*taken|already exists/i);
  });

it('should validate email format', async function () {
  this.timeout(20000);
  await registerPage.open('/register');

  await registerPage.type(registerPage.nameInput, 'name');
  await registerPage.type(registerPage.lastNameInput, 'surname');
  await registerPage.type(registerPage.usernameInput, 'nameee');
  await registerPage.type(registerPage.numberInput, '123456789');

  await registerPage.type(registerPage.emailInput, 'invalid-email');

  // Click the submit button to let browser run native validation
  await registerPage.click(registerPage.registerButton);

  // Give the browser time to run validation (helps avoid timing issues)
  await driver.sleep(500); // half a second pause

  // Get validation message from the actual input DOM element
const emailElement = await driver.findElement(registerPage.emailInput);

const validationMessage = await driver.executeScript(
  "return arguments[0].validationMessage;",
  emailElement
);


  console.log("Validation Message:", validationMessage); // helpful debug

  expect(validationMessage.toLowerCase()).to.include("please include an '@'");
});



  it('should require all mandatory fields', async function() {
    this.timeout(10000);
    await registerPage.open('/register');
    await registerPage.submitRegistration();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });

  it('should validate country and city selection', async function() {
    this.timeout(20000);
    await registerPage.open('/register');
    
    const testUser = {
      name: 'Test',
      lastName: 'User',
      number: '1234567890',
      email: `test${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      gender: 'Male',
      birthday: getBirthdate(30),
      country: '', // Empty country
      city: ''    // Empty city
    };

    await registerPage.fillRegistrationForm(testUser);
    await registerPage.submitRegistration();
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/register');
  });
});