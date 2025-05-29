@lists
Feature: Retrieve all lists

  Scenario: Owner successfully retrieves the list of items
    Given I am logged in as owner
    When I send a GET request to "/api/list"
    Then the response status code should be 200 for lists
    And the response should contain a list of items
