const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');
When('I add a new program with the following data:', async function (dataTable) {
  const data = dataTable.rowsHash();

  const longDescription = 'word '.repeat(250); // 1000+ characters

  const payload = {
    title: data.title,
    description: data.description === '<LONG_DESCRIPTION>' ? longDescription : data.description,
    createdById: parseInt(data.createdById),
  };

  try {
    this.programResponse = await axios.post('http://localhost:5001/api/program', payload, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error.response) {
      this.programResponse = error.response;
      console.error('Program creation error:', error.response.data);
    } else {
      throw error;
    }
  }
});

Then('the program creation status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(this.programResponse.status, expectedStatusCode);
});
