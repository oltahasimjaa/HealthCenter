const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

Given('I am logged in as owner', async function () {
  const credentials = { username: 'owner', password: 'owner' };

  try {
    const response = await axios.post('http://localhost:5001/api/login/login', credentials);
    this.accessToken = response.data.accessToken;
  } catch (error) {
    throw new Error('Failed to login as owner');
  }
});

When('I edit the schedule with id {int}', async function (scheduleId) {
  if (!this.accessToken) throw new Error('No access token found. Please login first.');

  // Fetch existing schedule
  const res = await axios.get(`http://localhost:5001/api/schedule/${scheduleId}`, {
    headers: { Authorization: `Bearer ${this.accessToken}` },
  });
  const existingSchedule = res.data;

  // Construct payload with required fields
  const updatedSchedule = {
    _id: existingSchedule._id,
    mysqlId: existingSchedule.mysqlId,
    specialistId: existingSchedule.specialistId._id, // or full object if needed
    workDays: existingSchedule.workDays,
    startTime: "08:00",
    endTime: "17:00",
    breakStartTime: "12:00",
    breakEndTime: "14:00",
    unavailableDates: []
  };

  // Send the update
  this.editScheduleResponse = await axios.put(
    `http://localhost:5001/api/schedule/${scheduleId}`,
    updatedSchedule,
    {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  ).catch(error => {
    this.editScheduleResponse = error.response;
    console.error('Server Error:', error.response.data); // Log detailed error
    throw error;
  });
});


Then('the response status code should be {int}', function (expectedStatusCode) {
  assert.strictEqual(this.editScheduleResponse.status, expectedStatusCode);
});

Then('the schedule should have the updated workDays', function () {
  const responseData = this.editScheduleResponse.data;
  assert.deepStrictEqual(responseData.workDays, [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]);
});
