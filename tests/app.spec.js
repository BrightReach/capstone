const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(
  path.resolve(__dirname, '../src/client/views/index.html'),
  'utf8'
);

jest.dontMock('fs');

/*let returnDate = new Date(document.getElementById('return-date').value);
let arrivalDate = new Date(document.getElementById('arrival-date').value);*/

describe('Date Checker', () => {
  const { app } = require('../src/client/js/app');

  beforeEach(() => {
    arrivalDate.setMilliseconds(1590624000000);
    returnDate.setMilliseconds(1591228800000);
  });
  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });
  test('It should pass the dateChecker function with the right date added', () => {
    expect(app.dateChecker(arrivalDate, returnDate)).resolves.anything();
  });
});
