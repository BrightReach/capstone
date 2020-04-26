process.env.NODE_ENV = 'test';
import 'regenerator-runtime/runtime';
const request = require('supertest');
const app = require('../src/server/server');

describe('GET / ', () => {
  test('It should respond with an array of different journeys', async () => {
    const response = await request(app).get('/all');
    expect(response.body).toBeDefined();
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /getWeather', () => {
  it('It should retrieve the data from the three APIs and send them back to server.', async () => {
    const res = await request(app).post('/getWeather').send({
      location: 'London',
      arrival: 1590624000000,
      return: 1591228800000,
      countdown: 33,
      tripDays: 7
    });
    expect(res.body).toBeDefined();
    expect(res.statusCode).toEqual(200);
  });
});
