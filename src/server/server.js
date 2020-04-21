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
const port = 8080;

// Setup Server
const server = app.listen(port, listening);

// Declares a callback function to confirm that the server is online
function listening() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
}

// GET route to return the project data to the client side script
app.get('/all', (request, response) => {
  response.send(projectData);
  console.log(projectData);
});

// POST route to push incoming data from client side as JSON data
app.post('/getWeather', (request, response) => {
  let newData = request.body;
  let newEntry = {
    temp: newData.temp,
    date: newData.date,
    response: newData.response,
  };
  projectData.push(newEntry);
  response.send(projectData);
});
