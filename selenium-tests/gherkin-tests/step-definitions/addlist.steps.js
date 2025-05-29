const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

When('I add a new list with the following data:', async function (dataTable) {
  const data = dataTable.rowsHash();

  const payload = {
    name: data.name,
    programId: parseInt(data.programId),
    createdById: parseInt(data.createdById),
  };

  try {
    this.listResponse = await axios.post('http://localhost:5001/api/list', payload, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error.response) {
      this.listResponse = error.response;
      console.error('List creation error:', error.response.data);
    } else {
      throw error;
    }
  }
});

Then('the list creation status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(this.listResponse.status, expectedStatusCode);
});
