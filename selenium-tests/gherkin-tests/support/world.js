const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.driver = null;
  }
}

setWorldConstructor(CustomWorld);
