// Global Variables
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?';
const apiKey = 'c643e032021c529e4a2a3f97488e7d36';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to use the callback function whenever the generate button has been clicked on
document.getElementById('generate').addEventListener('click', getWeather);

function getWeather(e) {
  // Declares the variables from both input values from the user
  const zipCode = document.getElementById('zip').value;
  const emotions = document.getElementById('feelings').value;

  // Executes retrieveData with the global variables and the zip code as parameters
  retrieveData(baseURL, zipCode, apiKey)
    /* Uses the data retrieved as JSON before executing postData function to
     * send data to server side with a POST route and retrieve the data as an array.
     */
    .then((data) =>
      postData('/getWeather', {
        temp: data.main.temp,
        date: newDate,
        response: emotions,
      })
    )

    // Retrieves the array through a GET route before updating the HTML of the website with the retrieved results
    .then((data) => getResults());
}

const retrieveData = async (url, zip, key) => {
  // Declares a request variable from the parameters with the await command to retrieve the website's url
  const request = await fetch(url + 'zip=' + zip + '&appid=' + key);
  try {
    // Retrieves the data as JSON object and returns it
    const data = await request.json();
    return data;
  } catch (error) {
    // Error handler
    console.log('error', error);
    logError(error);
  }
};

const postData = async (url = '', data = {}) => {
  // Declares a variable response variable from the parameters with await command to send the data from the POST route
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    // Retrieves the data as an array and returns it
    const newData = await response.json();
    return newData;
  } catch (error) {
    // Error handler
    console.log('Error: ', error);
    logError(error);
  }
};

const getResults = async () => {
  // Declares a request variable with the await command to retrieve data from the GET route
  const request = await fetch('/all');
  try {
    /* Retrieves the data as an array and updates the html inside the selected elements
     * with their corresponding IDs
     */
    const allData = await request.json();
    document.getElementById('temp').innerHTML =
      allData[allData.length - 1].temp;
    document.getElementById('date').innerHTML =
      allData[allData.length - 1].date;
    document.getElementById('content').innerHTML =
      allData[allData.length - 1].response;
  } catch (error) {
    // Error handler
    console.log('Error: ', error);
    logError(error);
  }
};

const logError = (e) =>
  (document.getElementById('content').innerHTML = `Error:${e}`);
