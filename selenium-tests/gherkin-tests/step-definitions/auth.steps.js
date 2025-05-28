const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

let loginResponse;

Given('I am at the login page', function () {
  // no-op or setup if needed
});

When('I send the username and password:', async function (dataTable) {
  const credentials = dataTable.rowsHash();

  try {
    loginResponse = await axios.post('http://localhost:5001/api/login/login', credentials);
    this.accessToken = loginResponse.data.accessToken;  // <-- store in world
  } catch (error) {
    if (error.response) {
      loginResponse = error.response;
      this.accessToken = null;
    } else {
      throw error;
    }
  }
});

Then('the response message should be {string}', function (expectedMessage) {
  assert.strictEqual(loginResponse.data.message, expectedMessage);
});

Then('the status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(loginResponse.status, expectedStatusCode);
});
