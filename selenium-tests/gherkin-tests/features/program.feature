Feature: Add a new program

  Scenario: Successfully adding a new program
    Given I am logged in as owner
    When I add a new program with the following data:
      | title       | Nutricion           |
      | description | Living a healthy life |
      | createdById | 1                   |
    Then the program creation status code should be 201
    
 Scenario: Adding a program with a description longer than 1000 characters
    Given I am logged in as owner
    When I add a new program with the following data:
      | title       | Long Description Test     |
      | description | <LONG_DESCRIPTION>        |
      | createdById | 1                         |
    Then the program creation status code should be 400