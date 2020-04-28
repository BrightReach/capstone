const generateBtn = document.getElementById('generate');

const getData = async () => {
  let date = new Date().getTime();

  // Resets the response div and hides it from the user.
  document.getElementById('response').innerHTML = '';
  document.getElementById('response').style.display = 'none';

  // Declares the variables of the user's arrival and the return date values.
  const arrivalDate = new Date(
    document.getElementById('arrival-date').value
  ).getTime();
  const returnDate = new Date(
    document.getElementById('return-date').value
  ).getTime();

  // Declares the countdown variable of when the user will arrive to the destination
  let countDays = Math.ceil((arrivalDate - date) / (1000 * 3600 * 24));

  // Declares a variable of how long the trip will last for
  let tripDays = 0;
  if (returnDate != NaN) {
    const timeDifference = returnDate - arrivalDate;
    tripDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  } else {
    tripDays = 0;
  }

  try {
    // Checks whenever the date(s) have been entered, if it's after today's date and the return date is after the arrival date
    await dateChecker(arrivalDate, returnDate);

    //Confirms whenever the location has been entered or if it has four characters and more.
    const data = await dataFilter();

    /* Uses the data retrieved as JSON before executing postData function to
     * send data to server side with a POST route and retrieve the data as an array.
     */
    const post = await postData({
      location: data.location,
      arrival: arrivalDate,
      return: returnDate,
      countdown: countDays,
      tripDays: tripDays,
    });
    // Retrieves the array through a GET route before updating the HTML of the website with the retrieved results
    await getResults();
  } catch (err) {
    logResponse(err);
    return;
  }
};

const dateChecker = async (arrival, departure, date) => {
  // Sets the departure parameter as "null" by default if there's no entry
  const returnDate = departure ? departure : null;

  if (isNaN(arrival)) throw new Error('Please enter the date of your arrival');
  if (date > arrival)
    throw new Error('The date of your arrival must be later than today');
  if (returnDate !== null && arrival > returnDate)
    throw new Error(
      'The date of your departure must be later than your arrival date'
    );
  return;
};

const dataFilter = async () => {
  let localEntry = await document.getElementById('location').value;
  let data = {};

  if (localEntry === null)
    throw new Error(
      "Please enter the name of the location you're traveling to."
    );
  if (localEntry.length < 4)
    throw new Error('Please enter four characters or more.');
  data = { location: localEntry };
  return data;
};

const postData = async (data = {}) => {
  const response = await fetch('http://localhost:8081/getWeather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
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

  // Executes function to update the DOM based on the retrieved data
  Client.createUI(allData);
  logResponse(
    `Data for ${
      allData[allData.length - 1].cityName
    } has been successfully retrieved!`
  );
};

const logResponse = (e) => {
  const container = document.getElementById('response');
  container.style.display = 'block';
  container.innerHTML = `${e}`;
  console.error(e);
};

// Executes the event listener if the generate button exists in the DOM
if (generateBtn) generateBtn.addEventListener('click', getData);

module.exports = {
  getData,
  getResults,
  postData,
  dataFilter,
  logResponse,
  dateChecker,
};
