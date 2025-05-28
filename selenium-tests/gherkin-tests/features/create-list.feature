Feature: Krijimi i listës

  Scenario: Shtimi i një liste të re
    Given përdoruesi është i kyçur
    When ai plotëson emrin me "Test List" dhe klikon "Shto"
    Then duhet të shfaqet lista me emrin "Test List"
