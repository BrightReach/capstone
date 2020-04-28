/**
 * @jest-environment jsdom
 */

describe('Date Checker', () => {
  const app = require('../src/client/js/app');

  const html = document.createElement('div');
  html.innerHTML = `<input type="date" id="arrival-date" required>
  <input type="date" id="return-date">
  <button id="generate" type="submit"> Generate </button>
`;
  document.body.appendChild(html);

  let arrival = new Date();
  let depart = new Date();

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('It should pass the dateChecker function with the right date added', async (done) => {
    arrival.setFullYear(2020, 4, 27);
    await expect(
      app.dateChecker(arrival.getTime(), null, new Date())
    ).resolves.toBeUndefined();
    done();
  });
  test('It should fail the dateChecker function if the arrival date has passed today', async (done) => {
    arrival.setFullYear(2020, 0, 1);
    await expect(
      app.dateChecker(arrival.getTime(), null, new Date())
    ).rejects.toThrow();
    done();
  });
  test('It should pass the dateChecker function with the right date added', async (done) => {
    arrival.setFullYear(2020, 4, 27);
    depart.setFullYear(2019, 4, 27);
    await expect(
      app.dateChecker(arrival.getTime(), depart.getTime(), new Date())
    ).rejects.toThrow();
    done();
  });
});

describe('Data Filter', () => {
  const app = require('../src/client/js/app');

  const html = document.createElement('div');
  html.innerHTML = `<input type="text" id="location" placeholder="For e.g. London England" required>
  <button id="generate" type="submit"> Generate </button>`;
  document.body.appendChild(html);

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('It should fail the test if the location is null', () => {
    expect(app.dataFilter()).rejects.toThrow();
  });
  test('It should pass the test if the location has been added', () => {
    let value = '';
    document.getElementById = jest.fn((id) => {
      if (id === 'location') value = 'London';
      return {
        value,
      };
    });
    expect(app.dataFilter()).resolves.toBe({ location: value });
  });
});
