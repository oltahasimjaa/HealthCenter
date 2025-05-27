const BasePage = require('./BasePage');
const { By, until  } = require('selenium-webdriver');

class ListPage extends BasePage {
  get nameInput() { return By.css('input[placeholder="name"]'); }
  get programSelect() { return By.css('select'); }
  get submitButton() { return By.css('button[type="submit"]'); }

  get listRows() { return By.css('tbody tr'); }
  get editButtons() { return By.xpath('//button[contains(text(), "Edit")]'); }
  get deleteButtons() { return By.xpath('//button[contains(text(), "Delete")]'); }

  get inlineNameInput() { return By.css('input[type="text"]'); }
  get saveButton() { return By.xpath('//button[contains(text(), "Save")]'); }
  get cancelButton() { return By.xpath('//button[contains(text(), "Cancel")]'); }

async createListItem(name, programTitle) {
  // Clear and type the name
  const nameField = await this.find(this.nameInput);
  await nameField.clear();
  await nameField.sendKeys(name);
  
  // Select program
  await this.selectFirstDropdownOption(this.programSelect);
  
  // Submit and wait properly
  await this.click(this.submitButton);
  
  // Wait for the new item to appear
  await this.waitForListItem(name);
}

async waitForListItem(name, timeout = 10000) {
  await this.driver.wait(async () => {
    const names = await this.getAllListNames();
    return names.includes(name);
  }, timeout, `Item "${name}" did not appear in list`);
}

async editFirstListItem(newName) {
  const editBtns = await this.findAll(this.editButtons);
  if (editBtns.length === 0) throw new Error("No Edit button found");
  await editBtns[0].click();

  // Wait for edit inputs to appear
  await this.driver.wait(until.elementLocated(this.inlineNameInput), 5000);
  await this.driver.wait(until.elementLocated(this.saveButton), 5000);

  const input = await this.find(this.inlineNameInput);
  await input.clear();
  await input.sendKeys(newName);

  const saveBtn = await this.find(this.saveButton);
  await saveBtn.click();
  
  // Wait for edit to complete
  await this.waitForListItem(newName);
}

  async deleteFirstListItem() {
    const deleteBtns = await this.findAll(this.deleteButtons);
    if (deleteBtns.length === 0) throw new Error("No Delete button found");
    await deleteBtns[0].click();
    await this.sleep(1000);
  }

  async getAllListNames() {
    const rows = await this.findAll(this.listRows);
    return Promise.all(rows.map(async row => {
      const nameCell = await row.findElement(By.css('td:nth-child(1)'));
      return await nameCell.getText();
    }));
  }
}

module.exports = ListPage;
