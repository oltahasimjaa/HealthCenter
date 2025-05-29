const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');

When('I send a POST request to {string} with the following data:', async function (endpoint, dataTable) {
  const data = dataTable.rowsHash();
  try {
    this.response = await axios.post(`http://localhost:5001${endpoint}`, {
      userId: Number(data.userId),
      programId: Number(data.programId),
      invitedById: Number(data.invitedById)
    });
  } catch (error) {
    this.response = error.response;
  }
});

Then('the user program response status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(this.response.status, expectedStatusCode);
});

Then('the response should confirm the user was added to the program', function () {
  const data = this.response.data;
  assert.ok(data);
  assert.ok(data.userId);
  assert.ok(data.programId);
});
When('I fetch the list of user programs', async function () {
  try {
    this.response = await axios.get('http://localhost:5001/api/userprograms');
    this.userPrograms = this.response.data;
  } catch (error) {
    this.response = error.response;
  }
});

When('I send a DELETE request to delete the last user program', async function () {
  if (!this.userPrograms || this.userPrograms.length === 0) {
    throw new Error('No user programs found to delete.');
  }
  // Get the last user program (you can sort by createdAt if needed)
  const lastUserProgram = this.userPrograms[this.userPrograms.length - 1];
  const idToDelete = lastUserProgram.mysqlId || lastUserProgram._id;

  try {
    this.response = await axios.delete(`http://localhost:5001/api/userprograms/${idToDelete}`);
  } catch (error) {
    this.response = error.response;
  }
});

Then('the user program response statuss code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(this.response.status, expectedStatusCode);
});

Then('the user program response messagee should be {string}', function (expectedMessage) {
  assert.strictEqual(this.response.data.message, expectedMessage);
});