const openTab = (e, entryName) => {
  // Declare all variables
  let i;

  // Get all elements with class="tabContent" and hide them
  const tabcontent = document.getElementsByClassName('tabContent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Get all elements with class="tabLinks" and remove the class "active"
  const tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(entryName).style.display = 'block';
  e.currentTarget.className += ' active';
};

const createUI = (data = []) => {
  console.log(data);
  const entryHolder = document.getElementById('entryHolder');
  entryHolder.innerHTML = `<div id="tab"></div>`;
  const tabHolder = document.getElementById('tab');

  for (let [i, value] of data.entries()) {
    console.log(i, value);

    let tabButton = document.createElement('button');
    tabButton.classList.add('tablinks');
    tabButton.setAttribute('id', `tab${i}`);
    tabButton.setAttribute('onclick', `Client.openTab(event, 'entry${i}')`);
    tabButton.innerText = `Entry ${i + 1}/${value.cityName}`;
    tabHolder.appendChild(tabButton);
    console.log('Button added');

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
    console.log(i + ' Entry added');
  }
};

const createWeather = (data = []) => {
  const container = document.createElement('div');
  for (const elem of data) {
    console.log(elem, data);
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
  const response = await fetch('http://localhost:8081/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const message = await response.json();
  console.log(message);
  Client.logError(message.body);
  document.getElementById(tab).remove();
  entry.remove();
};

export { openTab, createUI, createCountdown, createWeather, deleteEntry };
