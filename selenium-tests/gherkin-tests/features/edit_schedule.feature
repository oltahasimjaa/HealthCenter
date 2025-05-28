Feature: Edit Specialist Schedule

  Scenario: Logged in owner edits a schedule successfully
    Given I am logged in as owner
    When I edit the schedule with id 4
    Then the response status code should be 200
    And the schedule should have the updated workDays
