const dotenv = require('dotenv');
dotenv.config();

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

function getRandomInt(max) {
  const min = 0;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const getForecast = async (data = {}) => {
  const forecastType = data.countdown <= 7 ? 'current' : 'daily';
  const res = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/${forecastType}&lat=${data.lat}&lon=${data.long}&key=${process.env.WEATHERBIT_API_KEY}`
  );
  let newData = {};

  try {
    const weatherData = await res.json();
    newData = {
      weather: weatherData[0].weather,
      countdown: newData.countdown,
      trip_days: newData.trip_days,
      city_name: weatherData[0].city_name,
      wind_spd: weatherData[0].wind_spd,
      wind_dir: weatherData[0].wind_dir,
      temp: weatherData[0].temp,
      app_temp: weatherData[0].app_temp,
    };
    return newData;
  } catch (error) {
    console.error(error.message);
  }
};

// GET route to return the project data to the client side script
app.get('/all', (request, response) => {
  response.send(projectData);
  console.log(projectData);
});

// POST route to push incoming data from client side as JSON data
app.post('/getWeather', (request, response) => {
  let newData = request.body;
  let newEntry = {};
  geonames
    .search({ q: newEntry.location }) //get continents
    .then((resp) => {
      newEntry = {
        location: newData.location,
        arr_date: newData.arr_date,
        ret_date: newData.ret_date,
        countdown: newData.countdown,
        trip_days: newData.trip_days,
        lat: resp.geonames[0].lat,
        long: resp.geonames[0].lng,
      };
      getForecast(newEntry);
      console.log(resp.geonames[0]);
    })
    .then(async (data) => {
      const pixabay_res = await fetch(
        `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${data.city_name}&image_type=photo&pretty=true`
      );
      const pixabay = await pixabay_res.json();
      const pixabayIndex = getRandomInt(pixabay.length);
      newEntry = {
        weather: weatherData[0].weather,
        countdown: newData.countdown,
        trip_days: newData.trip_days,
        city_name: weatherData[0].city_name,
        wind_spd: weatherData[0].wind_spd,
        wind_dir: weatherData[0].wind_dir,
        temp: weatherData[0].temp,
        app_temp: weatherData[0].app_temp,
        picture: pixabay[pixabayIndex].webformatURL,
      };
      projectData.push(newEntry);
      response.send(projectData);
    })
    .catch((err) => console.error(err));
});
