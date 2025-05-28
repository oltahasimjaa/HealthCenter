Feature: User Auth

@test
  Scenario:  Successful Owner Role login with valid credentials
    Given I am at the login page
    When I send the username and password:
      | username | owner |
      | password | owner |
      Then the status code should be 200
      Then the response message should be "Login i suksesshëm"

  Scenario: Successful Client Role login with valid credentials
    Given I am at the login page
    When I send the username and password:
      | username | no1 |
      | password | fddb7b8b8524d1a3 |
      Then the status code should be 200
      Then the response message should be "Login i suksesshëm"


  Scenario: UnSuccessful login attempt with invalid credentials
    Given I am at the login page
    When I send the username and password:
      | username | owner |
      | password | aa |
      Then the status code should be 401
      Then the response message should be "Login i dështuar. Provoni përsëri."


      
  Scenario: UnSuccessful login attempt with empty credentials
    Given I am at the login page
    When I send the username and password:
      | username |  |
      | password |  |
      Then the status code should be 401
      Then the response message should be "Login i dështuar. Provoni përsëri."