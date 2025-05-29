const BasePage = require('./BasePage');
const { By, until } = require('selenium-webdriver');

class ProgramPage extends BasePage {
  // Form elements
  get titleInput() { 
    return By.css('input[placeholder="Title"]'); 
  }
  
  get descriptionTextarea() { 
    return By.css('textarea[placeholder="Description (optional)"]'); 
  }
  
  get submitButton() { 
    return By.css('button[type="submit"]'); 
  }
  
  // Table elements
  get programRows() { 
    return By.css('tbody tr'); 
  }
  
  get programTitleLinks() { 
    return By.css('tbody tr td:nth-child(1) a'); 
  }
  
  get programDescriptions() { 
    return By.css('tbody tr td:nth-child(2)'); 
  }
  
  // Action buttons
  get editButtons() { 
    return By.xpath('//button[contains(text(), "Edit")]'); 
  }
  
  get deleteButtons() { 
    return By.xpath('//button[contains(text(), "Delete")]'); 
  }
  
  // Delete confirmation modal
  get deleteModal() { 
    return By.css('[role="dialog"]'); 
  }
  
  get deleteModalTitle() { 
    return By.css('[role="dialog"] h2'); 
  }
  
  get confirmDeleteButton() { 
    return By.xpath('//button[contains(text(), "Delete")]'); 
  }
  
  get cancelDeleteButton() { 
    return By.xpath('//button[contains(text(), "Cancel")]'); 
  }
  
  // Error messages
  get errorMessages() { 
    return By.css('.text-red-500'); 
  }
  
  // Empty state
  get emptyStateMessage() { 
    return By.xpath('//td[contains(text(), "Nuk ka të dhëna")]'); 
  }

  // Methods

  async isFormDisplayed() {
    return this.isDisplayed(this.titleInput);
  }

async createProgram(title, description = '') {
  await this.type(this.titleInput, title);
  if (description) {
    await this.type(this.descriptionTextarea, description);
  }

  const submit = await this.find(this.submitButton);
  await this.driver.executeScript("arguments[0].click();", submit);

  await this.driver.wait(async () => {
    const titles = await this.getAllProgramTitles();
    console.log('Checking for title:', title);
    console.log('Current titles:', titles);
    return titles.includes(title);
  }, 10000); // rrit timeout për siguri
}



  async editFirstProgram(newTitle, newDescription = '') {
  const editBtns = await this.findAll(this.editButtons);
  if (editBtns.length === 0) throw new Error("No programs available to edit");
  await editBtns[0].click();

  // Wait for form fields to appear
  const titleInput = await this.driver.wait(until.elementLocated(this.titleInput), 5000);
  await this.driver.wait(until.elementIsVisible(titleInput), 5000);
  
  await titleInput.clear();
  await titleInput.sendKeys(newTitle);

  if (newDescription) {
    const descInput = await this.driver.wait(until.elementLocated(this.descriptionTextarea), 5000);
    await this.driver.wait(until.elementIsVisible(descInput), 5000);
    await descInput.clear();
    await descInput.sendKeys(newDescription);
  }

  await this.click(this.submitButton);

  // ✅ Wait for list to refresh with the new title
  await this.driver.wait(async () => {
    const titles = await this.getAllProgramTitles();
    return titles.includes(newTitle);
  }, 5000);
}

async deleteProgramByIndex(index = 0) {
    const deleteButtons = await this.findAll(this.deleteButtons);
    if (deleteButtons.length === 0) throw new Error("Nuk ka programe për të fshirë");
    if (index >= deleteButtons.length) throw new Error("Indeksi jashtë kufijve të listës");

    await deleteButtons[index].click();

    await this.driver.sleep(1000);

    const modalElem = await this.driver.wait(until.elementLocated(this.deleteModal), 15000);
    await this.driver.wait(until.elementIsVisible(modalElem), 15000);

    const confirm = await this.find(this.confirmDeleteButton);
    await confirm.click();

    await this.driver.wait(until.stalenessOf(modalElem), 15000);
  }


  async getAllProgramTitles() {
    const titles = [];
    const elements = await this.findAll(this.programTitleLinks);
    
    for (const el of elements) {
      titles.push(await el.getText());
    }
    
    return titles;
  }

  async clickFirstProgramTitle() {
    const firstTitle = await this.find(this.programTitleLinks);
    const titleText = await firstTitle.getText();
    await firstTitle.click();
    return titleText;
  }
}

module.exports = ProgramPage;
