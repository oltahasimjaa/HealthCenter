@list
Feature: Add a new list

  Scenario: Successfully adding a new list
    Given I am logged in as owner
    When I add a new list with the following data:
      | name        | List 2  |
      | programId   | 100     |
      | createdById | 1       |
    Then the list creation status code should be 201