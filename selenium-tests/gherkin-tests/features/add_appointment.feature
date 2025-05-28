Feature: Appointment create

Scenario: Logged in owner creates an appointment
  Given I am at the login page
  When I send the username and password:
    | username | owner |
    | password | owner |
  Then the status code should be 200
  When I will create an appointment
  Then the appointment creation status code should be 201
