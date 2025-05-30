const BasePage = require('./BasePage');
const { By, until } = require('selenium-webdriver');

class UserProgramsPage extends BasePage {
  get userSelect() { return By.css('select:nth-of-type(1)'); }
  get programSelect() { return By.css('select:nth-of-type(2)'); }
  get submitButton() { return By.css('button[type="submit"]'); }

  get userProgramRows() { return By.css('tbody tr'); }
  get editButtons() { return By.xpath('//button[contains(text(), "Edit")]'); }
  get deleteButtons() { return By.xpath('//button[contains(text(), "Delete")]'); }

  async createUserProgram(userIndex = 0, programIndex = 0) {
    // Wait for and select user
    await this.driver.wait(until.elementLocated(this.userSelect), 5000);
    await this.selectDropdownOptionByIndex(this.userSelect, userIndex);
    
    // Wait for and select program
    await this.driver.wait(until.elementLocated(this.programSelect), 5000);
    await this.selectDropdownOptionByIndex(this.programSelect, programIndex);
    
    // Submit
    await this.click(this.submitButton);
    
    // Wait for creation
    await this.sleep(1000);
  }

  async deleteFirstUserProgram() {
    const deleteBtns = await this.findAll(this.deleteButtons);
    if (deleteBtns.length === 0) throw new Error("No Delete button found");
    await deleteBtns[0].click();
    await this.sleep(1000);
  }
}

module.exports = UserProgramsPage;
