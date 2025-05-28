const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.driver = null;
       this.accessToken = null;
    this.appointmentResponse = null;
       this.programResponse = null;
  }
}

setWorldConstructor(CustomWorld);
