await driver.get('http://localhost:3000/appointments/new');
await driver.findElement(By.name('date')).sendKeys('2025-06-01');
await driver.findElement(By.name('time')).sendKeys('14:00');
await driver.findElement(By.name('doctor')).sendKeys('DR');
await driver.findElement(By.css('button[type="submit"]')).click();

await driver.wait(until.urlContains('/appointments'), 5000);
console.log("✅ Takimi u krijua me sukses.");
