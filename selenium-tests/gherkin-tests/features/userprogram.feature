@userprogram
Feature: Add users to a program

  Scenario: Successfully add a user to a program and auto-add the inviter
    Given I am logged in as owner
    When I send a POST request to "/api/userprograms" with the following data:
      | userId       | 2   |
      | programId    | 101 |
      | invitedById  | 1   |
    Then the user program response status code should be 201
    And the response should confirm the user was added to the program
   


Scenario: Successfully delete the last user program
  Given I am logged in as owner
  When I fetch the list of user programs
  And I send a DELETE request to delete the last user program
  Then the user program response statuss code should be 200
  And the user program response messagee should be "UserPrograms deleted"
