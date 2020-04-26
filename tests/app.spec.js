const app = require('../src/client/js/app');

/*const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(
  path.resolve(__dirname, '../src/client/views/index.html'),
  'utf8'
);

jest.dontMock('fs');*/

/*let returnDate = new Date(document.getElementById('return-date').value);
let arrivalDate = new Date(document.getElementById('arrival-date').value);*/

/*describe('Date Checker', () => {
  const html = document.createElement('div');
  html.innerHTML = `<input type="date" id="arrival-date" required>
<input type="date" id="return-date">
<input type="text" id="location" placeholder="For e.g. London England" required>
<button id="generate" type="submit"> Generate </button>
`;
  document.body.appendChild(html);

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
*/

describe('Data Filter', () => {
  const html = document.createElement('div');
  html.innerHTML = `<input type="date" id="arrival-date" required>
<input type="date" id="return-date">
<input type="text" id="location" placeholder="For e.g. London England" required>
<button id="generate" type="submit"> Generate </button>`;
  document.body.appendChild(html);
  const generateBtn = document.getElementById('generate');
  generateBtn.simulate('click');
  test('It should fail the test if the location is null', (done) => {
    //document.getElementById('location').value
    expect(app.dataFilter()).rejects.toThrow();
  });
});
