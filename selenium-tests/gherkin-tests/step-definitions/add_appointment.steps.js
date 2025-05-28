const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

When('I will create an appointment', async function () {
  if (!this.accessToken) {
    throw new Error('No access token found. Please login first.');
  }

  const payload = {
    userId: 1,
    specialistId: "681a3d888f4003eca0da9187",
    appointmentDate: "2025-05-29T15:00:00.000Z",
    type: "therapy",
    notes: "",
    status: "pending"
  };

  try {
    this.appointmentResponse = await axios.post(
      'http://localhost:5001/api/appointment',
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    if (error.response) {
      this.appointmentResponse = error.response;
    } else {
      throw error;
    }
  }
});

Then('the appointment creation status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(this.appointmentResponse.status, expectedStatusCode);
});
