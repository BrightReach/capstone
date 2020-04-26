// Global Variables

// Create a new date instance dynamically with JS
let date = new Date().getTime();

// Event listener to use the callback function whenever the generate button has been clicked on
document.getElementById('generate').addEventListener('click', getData());

const getData = async () => {
  // Declares the variables from both input values from the user
  document.getElementById('response').innerHTML = '';
  document.getElementById('response').style.display = 'none';

  const arrivalDate = new Date(
    document.getElementById('arrival-date').value
  ).getTime();
  const returnDate = new Date(
    document.getElementById('return-date').value
  ).getTime();

  let countDays = Math.ceil((arrivalDate - date) / (1000 * 3600 * 24));
  let tripDays = 0;
  if (returnDate != NaN) {
    const timeDifference = returnDate - arrivalDate;
    tripDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  } else {
    tripDays = 0;
  }

  // Executes retrieveData with the global variables and the zip code as parameters
  //retrieveData(baseURL, zipCode, apiKey)
  try {
    await dateChecker(arrivalDate, returnDate);
    const data = await dataFilter();
    /* Uses the data retrieved as JSON before executing postData function to
     * send data to server side with a POST route and retrieve the data as an array.
     */
    const post = await postData({
      location: data.location,
      arrival: arrivalDate,
      return: returnDate,
      countdown: countDays,
      tripDays: tripDays
    });
    // Retrieves the array through a GET route before updating the HTML of the website with the retrieved results
    const res = await getResults();
  } catch (err) {
    logError(err);
    return;
  }
};

const dateChecker = async (arrival, departure) => {
  const returnDate = departure ? departure : null;

  console.log(`${returnDate} < ${arrival}`);
  if (isNaN(arrival)) throw new Error('Please enter the date of your arrival');
  if (date > arrival)
    throw new Error('The date of your arrival must be later than today');
  if (returnDate !== null && arrival > returnDate)
    throw new Error(
      'The date of your departure must be later than your arrival date'
    );

  console.log(arrival);
  return;
};

const dataFilter = async () => {
  let localEntry = await document.getElementById('location').value;
  console.log('@dataFilter');
  let data = {};

  if (localEntry === null)
    throw new Error(
      "Please enter the name of the location you're traveling to."
    );
  if (localEntry.length < 4)
    throw new Error('Please enter four characters or more.');
  data = { location: localEntry };
  console.log('point 1 ' + Object.values(data));
  return data;
};

const postData = async (data = {}) => {
  // Declares a variable response variable from the parameters with await command to send the data from the POST route
  console.log(data);
  const response = await fetch('http://localhost:8081/getWeather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  // Retrieves the data as an array and returns it
  const newData = await response.json();
  return newData;
};

const getResults = async () => {
  // Declares a request variable with the await command to retrieve data from the GET route
  const request = await fetch('http://localhost:8081/all');

  /* Retrieves the data as an array and updates the html inside the selected elements
   * with their corresponding IDs
   */
  const allData = await request.json();
  /*for (var i in allData) {
    console.log(i, allData[i]);
    document.getElementById('content').innerHTML = allData[i];
  }*/
  Client.createUI(allData);
};

const logError = (e) => {
  const container = document.getElementById('response');
  container.style.display = 'block';
  container.innerHTML = `${e}`;
  console.error(e);
};

export { getData, getResults, postData, dataFilter, logError, dateChecker };
