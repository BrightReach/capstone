const openTab = (e, entryName) => {
  let i;
  const tabcontent = document.getElementsByClassName('tabContent');

  // Sets the diplay for every tabcontent found within the array to none
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Removes the active class from each tablinks found within the array
  const tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Sets the display of the specific tabcontent to block and the respective tab to active
  document.getElementById(entryName).style.display = 'block';
  e.currentTarget.className += ' active';
};

const createUI = (data = []) => {
  // Declares the objects found with their respective ids and sets an empty tab div within entryHolder.
  const entryHolder = document.getElementById('entryHolder');
  entryHolder.innerHTML = `<div id="tab"></div>`;
  const tabHolder = document.getElementById('tab');

  for (let [i, value] of data.entries()) {
    /* Creates a tab based on each data within the array to match its respective entry,
     * which includes the index to identify each entry.
     */
    let tabButton = document.createElement('button');
    tabButton.classList.add('tablinks');
    tabButton.setAttribute('id', `tab${i}`);
    tabButton.setAttribute('onclick', `Client.openTab(event, 'entry${i}')`);
    tabButton.innerText = `Entry ${i + 1}/${value.cityName}`;
    tabHolder.appendChild(tabButton);

    /* Creates an entry to hold the user's chosen destination, the current weather
     * or forecast weather, the countdown before the travel and a remove button
     * to delete the entry.
     */
    let entry = document.createElement('div');
    const picture =
      value.picture !== null ? `<img src="${value.picture}">` : '';
    entry.classList.add('tabContent');
    entry.setAttribute('data-index', i);
    entry.setAttribute('id', `entry${i}`);
    entry.innerHTML = `<h3>${value.cityName}</h3>
    ${createCountdown(value)}
    ${picture}
    ${createWeather(value.weather)}
    <div class="container"> <button class="delete" onclick="Client.deleteEntry('entry${i}', 'tab${i}')" type="submit"> Remove </button>
    </div>`;
    entryHolder.appendChild(entry);
  }
};

const createWeather = (data = []) => {
  const container = document.createElement('div');
  for (const elem of data) {
    // Generates a weather card to hold the weather icon, it's description and the temperature for every weather data within the array.
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<h4>${elem.datetime}</h4>
        <div class="weather">
          <img src="https://www.weatherbit.io/static/img/icons/${elem.weather.icon}.png">
          <p>${elem.weather.description}</p>
        </div>
        <div>Temp: ${elem.temp}<span>&#8451;</span></div>`;
    container.appendChild(card);
  }
  return container.innerHTML;
};

const createCountdown = (elem) => {
  // Generates a set of headers to indicate when the user is due to arrive and how long the holidays are.
  const countdown = elem.countdown;
  const tripDays =
    elem.tripDays === null
      ? ''
      : `<h4>Length of Journey: ${elem.tripDays}</h4>`;
  const entry = document.createElement('div');
  entry.innerHTML = `<h4>Days before your journey: ${countdown}</h4>
  ${tripDays}`;
  return entry.innerHTML;
};

const deleteEntry = async (target, tab) => {
  const entry = document.getElementById(target);
  const data = { index: entry.getAttribute('data-index') };

  /* Send a POST command to the backend to delete the entry
   * from that specific index and returns a response whenever
   * the execution was successful. */
  const response = await fetch('http://localhost:8081/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const message = await response.json();
  Client.logResponse(message.body);

  // Deletes the respective tab and entry content.
  document.getElementById(tab).remove();
  entry.remove();
};

module.exports = {
  openTab,
  createUI,
  createCountdown,
  createWeather,
  deleteEntry,
};
