//import { dateChecker } from './../src/client/js/app';
const app = require('./../src/client/js/app');

document.body.innerHTML = `
<input type="date" id="arrival-date" required>
<input type="date" id="return-date">
<input type="text" id="location" placeholder="For e.g. London England" required>
<button id="generate" type="submit"> Generate </button>
`;

let returnDate = new Date(document.getElementById('return-date').value);
let arrivalDate = new Date(document.getElementById('arrival-date').value);

beforeEach(() => {
  arrivalDate.setMilliseconds(1590624000000);
  returnDate.setMilliseconds(1591228800000);
});

describe('Date Checker', () => {
  test('It should pass the dateChecker function with the right date added', () => {
    document.getElementById('generate').addEventListener('click', async () => {
      expect(app.dateChecker(arrivalDate, returnDate)).resolves.anything();
    });
  });
});
