const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');


When('I send a GET request to {string}', async function (endpoint) {
  try {
    this.response = await axios.get(`http://localhost:5001${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  } catch (error) {
    if (error.response) {
      this.response = error.response;
    } else {
      throw error;
    }
  }
});

// In getlists.steps.js
Then('the response status code should be {int} for lists', function (expectedStatusCode) {
  assert.strictEqual(this.response.status, expectedStatusCode);
});



Then('the response should contain a list of items', function () {
  // Assuming the API returns an array as the response data
  assert.ok(Array.isArray(this.response.data), 'Response data should be an array');
  assert.ok(this.response.data.length > 0, 'List of items should not be empty');
});
