// Global Variables
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?';
const apiKey = 'c643e032021c529e4a2a3f97488e7d36';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
let arrival_Date = document.getElementById('arrival-date').value;
let return_Date = document.getElementById('return-date').value;

// Event listener to use the callback function whenever the generate button has been clicked on
document.getElementById('generate').addEventListener('click', () => {
  // Declares the variables from both input values from the user

  const arrivalDate = new Date(arrival_Date);
  const returnDate = new Date(return_Date);
  console.log(`${arrivalDate} ${returnDate}`);

  let countDays = Math.floor((arrivalDate - d) / (1000 * 3600 * 24));
  let tripDays = 0;
  if (returnDate != null) {
    const timeDifference = returnDate - arrivalDate;
    tripDays = Math.floor(timeDifference / (1000 * 3600 * 24));
  } else {
    tripDays = 0;
  }

  // Executes retrieveData with the global variables and the zip code as parameters
  //retrieveData(baseURL, zipCode, apiKey)
  dateChecker()
    .then(
      dataFilter()
      /* Uses the data retrieved as JSON before executing postData function to
       * send data to server side with a POST route and retrieve the data as an array.
       */
    )
    .then((data) =>
      postData('/getWeather', {
        location: data.location,
        arr_date: arrivalDate,
        ret_date: returnDate,
        countdown: countDays,
        trip_days: tripDays
      })
    )

    // Retrieves the array through a GET route before updating the HTML of the website with the retrieved results
    .then((data) => getResults());
});

const dateChecker = async () => {
  try {
    console.log(`${d} < ${arrivalDate}`);
    if (d < arrivalDate) {
      throw 'The date of your arrival must be later than today';
    } else {
      if (arrivalDate > returnDate && returnDate != null) {
        throw 'The date of your departure must be later than your arrival date';
      } else {
        return;
      }
    }
  } catch (error) {
    logError(error);
  }
};

const dataFilter = async () => {
  const localEntry = await document.getElementById('location').value;
  const zipRegex = RegExp('d{5}([ -]d{4})?');
  const pcRegex = RegExp(
    'GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(d[dA-Z]?[ ]?d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?d{1,4}'
  );
  const minChar = RegExp('.{4,}');
  let data = {};
  try {
    if (
      zipRegex.test(localEntry) ||
      pcRegex.test(localEntry) ||
      localEntry != null
    ) {
      data = { location: localEntry };
    } else if (!minChar.test(localEntry)) {
      throw 'Please enter four characters or more.';
    } else if (localEntry === null) {
      throw "Please enter the Zip/Post Code or the name of the location you're traveling to.";
    }
  } catch (err) {
    logError(err);
  }
  console.log(data);
  return data;
};

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

const postData = async (data = {}) => {
  // Declares a variable response variable from the parameters with await command to send the data from the POST route
  const response = await fetch('http://localhost:8081/getWeather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  try {
    // Retrieves the data as an array and returns it
    const newData = await response.json();
    return newData;
  } catch (err) {
    // Error handler
    console.log('Error: ', err);
    logError(err);
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
    document.getElementById('content').innerHTML = allData[allData.length - 1];
  } catch (error) {
    // Error handler
    console.log('Error: ', error);
    logError(error);
  }
};

const logError = (e) =>
  (document.getElementById('content').innerHTML = `Error: ${e}`);

export { getResults, postData, dataFilter, logError, dateChecker };
