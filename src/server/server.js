// Setup for dotenv to use .env file
const dotenv = require('dotenv');
dotenv.config();

// Setup to use fetch within node.js
const fetch = require('node-fetch');

// Setup and start up an instance of the Geonames API
const Geonames = require('geonames.js');
const geonames = new Geonames({
  username: process.env.GEONOME_USERNAME,
  lan: 'en',
  encoding: 'JSON',
});

// Setup empty JS object to act as endpoint for all routes
let projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Initalize the port number of the localhost server
const port = 8081;

// Declares a callback function to confirm that the server is online
const listening = () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Example app listening at http://${host}:${port}`);
};

// Setup Server
const server = app.listen(port, listening);

// Generates a random integer based on the parameter
function getRandomInt(max) {
  const min = 0;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const getForecast = async (data = {}) => {
  // Returns the forecast type for the url based on the countdown before arriving at the user's destination
  const forecastType = data.countdown <= 7 ? 'current' : 'forecast/daily';

  const res = await fetch(
    'https://api.weatherbit.io/v2.0/' +
      forecastType +
      '?lat=' +
      data.lat +
      '&lon=' +
      data.long +
      '&key=' +
      process.env.WEATHERBIT_API_KEY
  );
  let newData = {};
  const weatherData = await res.json();

  // Retrieves the location's name based on the type of forecast API used.
  const cityName =
    forecastType === 'current'
      ? weatherData.data[0].city_name
      : weatherData.city_name;

  newData = {
    weather: weatherData.data,
    countdown: data.countdown,
    tripDays: data.tripDays,
    cityName: cityName,
  };
  return newData;
};

// GET route to return the project data to the client side script
app.get('/all', (request, response) => {
  response.send(projectData);
  console.log(projectData);
});

// POST route to delete an index from the client side's command.
app.post('/delete', (request, response) => {
  const deleteIndex = projectData.splice(request.index, 1);
  console.log(deleteIndex);
  response.send({ body: 'Your entry has been deleted.' });
});

// POST route to push incoming data from client side as JSON data
app.post('/getWeather', async (request, response) => {
  let newData = request.body;
  let newEntry = {};
  try {
    const local = await geonames.search({ q: newData.location });
    newEntry = await {
      location: local.toponymName,
      arrival: newData.arrival,
      return: newData.return,
      countdown: newData.countdown,
      tripDays: newData.tripDays,
      lat: local.geonames[0].lat,
      long: local.geonames[0].lng,
    };
    const weather = await getForecast(newEntry);

    const pixabayRes = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${weather.cityName}&image_type=photo&pretty=true`
    );
    const pixabay = await pixabayRes.json();
    const pixabayPic =
      pixabay.total === 0
        ? null
        : pixabay.hits[getRandomInt(pixabay.hits.length)].webformatURL;
    newEntry = {
      weather: weather.weather,
      countdown: newData.countdown,
      tripDays: newData.tripDays,
      cityName: weather.cityName,
      picture: pixabayPic,
    };
    projectData.push(newEntry);
    response.send(projectData);
  } catch (err) {
    console.error(err);
    response.render('response', { error: err });
  }
});

module.exports = app;
