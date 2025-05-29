const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

let authToken;
let response;



When('I edit the list with ID {int} using the following data:', async function (listId, dataTable) {
  const data = dataTable.rowsHash();

  const payload = {
    name: data.name,
    programId: parseInt(data.programId),
    createdById: parseInt(data.createdById)
  };

  response = await axios.put(`http://localhost:5001/api/list/${listId}`, payload, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
});

Then('the list update status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(response.status, expectedStatusCode);
});
