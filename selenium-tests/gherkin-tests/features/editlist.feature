@list1
Feature: Edit List
  As an owner
  I want to be able to edit an existing list
  So that the information stays up to date

  Scenario: Successfully editing an existing list
    Given I am logged in as owner
    When I edit the list with ID 20 using the following data:
      | name        | lista e 2              |
      | programId   | 100                    |
      | createdById | 1                      |
    Then the list update status code should be 200
