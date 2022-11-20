$(document).ready(() => {
  // Search/History Elements
  const searchCityEl = $("#search-city");
  const searchBtnEl = $("#search-button");
  const clearBtnEl = $("#clear-history");
  const historyEl = $("#history");

  // Display Results Elements
  var currentWeatherEl = $("#current-weather");
  const cityNameEl = $("#city-name");
  const currentIconEl = $("#current-icon");
  const currentTempEl = $("#temperature");
  const currentWindEl = $("#wind-speed");
  const currentHumEl = $("#humidity");
  var fiveDayEl = $("#fiveday-header");
  const forecastEls = $(".forecast");

  // Get search history from localStorage or empty array
  var searchHistory = JSON.parse(localStorage.getItem("query")) || [];

  // APIKey
  const APIKey = "3ddf8b774ef8c410e4f09e55de10f6b4";

  // Send city query to openweather API and retrieve weather data
  function getWeather(city) {
    // Create query url for current weather
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Make current conditions element visible
        currentWeatherEl.removeClass("d-none");

        // Create date/time to place next to city name in current conditions
        const currentDate = dayjs().format("(D/M/YYYY)");

        // Display city name and current date im current conditions
        cityNameEl.html(`${data.name} ${currentDate}`);

        // Get the weather icon value
        let weatherIcon = data.weather[0].icon;

        // Set the <img> elements src attribute to get the current weather icon image
        currentIconEl.attr(
          "src",
          `https://openweathermap.org/img/wn/${weatherIcon}.png`
        );

        // Set current temperture
        currentTempEl.html(
          `Temperature: ${tempConvert(data.main.temp).f} &#176F`
        );

        // Set current wind speed
        currentWindEl.html(`Wind Speed: ${data.wind.speed} MPH`);

        // Set current humidity
        currentHumEl.html(`Humidity: ${data.main.humidity}%`);

        // 5 day forecast for the selected city
        // Get the id of the selected city
        let cityId = data.id;

        // Create query url for the 5 day forecast
        let forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${APIKey}`;

        fetch(forecastQueryURL)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            // Make 5 day forecast <h3> element visible
            fiveDayEl.removeClass("d-none");

            // Store the updated forecastDate through each iteration of the loop
            let forecastDate;

            // Get forecast data and inject to HTML
            for (let i = 0; i < forecastEls.length; i++) {
              // Clear/reset 5 day forecast
              forecastEls[i].innerHTML = "";

              // Index for weather forecast data
              // This pattern gets data for the same time on each of the 5 days
              const forecastIndex = i * 8 + 4;

              // Add one day to the current date
              forecastDate = dayjs()
                .add(i + 1, "day")
                .toString();

              // Format the date
              let formattedForecastDate =
                dayjs(forecastDate).format("(D/M/YYYY)");

              // Make a forecastDate element and append to the corresponding Day # forecast
              const forecastDateEl = document.createElement("p");
              forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = formattedForecastDate;
              forecastEls[i].append(forecastDateEl);
              // const forecastDateEl = $("<p>");
              //forecastDateEl.attr("class", "mt-3 mb-0 forecast-date");
              //forecastDateEl.html(formattedForecastDate);
              // forecastEls[i].append(forecastDateEl);

              // Make an element to hold the forecast weather icon
              const forecastIconEl = document.createElement("img");

              // Get the forecast weather icon value
              let forecastWeatherIcon =
                data.list[forecastIndex].weather[0].icon;

              // Set the <img> elements src attribute to get the icon image
              forecastIconEl.setAttribute(
                "src",
                `https://openweathermap.org/img/wn/${forecastWeatherIcon}@2x.png`
              );

              // Append forecast weather icon
              forecastEls[i].append(forecastIconEl);

              // Make forecast temperature element and append
              const forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = `Temperature: ${
                tempConvert(data.list[forecastIndex].main.temp).f
              } &#176F`;
              forecastEls[i].append(forecastTempEl);

              // Make forecast humidity element and append
              const forecastHumidityEl = document.createElement("p");
              forecastHumidityEl.innerHTML = `Humidity: ${data.list[forecastIndex].main.humidity}%`;
              forecastEls[i].append(forecastHumidityEl);
            }
          });
      });
  }

  // Convert kelvin to celsius/fahrenheit
  function tempConvert(temp) {
    // Create temperature object
    const allTemps = {
      k: temp,
      c: (temp - 273.15).toFixed(1),
      f: (1.8 * (temp - 273.15) + 32).toFixed(1),
    };
    return allTemps;
  }

  // Retrieve data from localStorage
  searchBtnEl.on("click", function () {
    // Get city value currently in searchbar
    const query = searchCityEl.val();

    // Get weather for city value
    getWeather(query);

    // Add city value to searchHistory array
    searchHistory.push(query);

    // Add array to localStorage
    localStorage.setItem("query", JSON.stringify(searchHistory));

    // Generate search history in HTML
    genSeachHistory();
  });

  // Clear history
  clearBtnEl.on("click", function () {
    localStorage.clear();
    searchHistory = [];
    // Generate search history in HTML
    genSeachHistory();
    // Clear all weather data presented on the page
    location.reload();
  });

  // Generate seach history in HTML
  function genSeachHistory() {
    // Clear/reset search history
    historyEl.html("");

    // Make seach history items
    for (let i = 0; i < searchHistory.length; i++) {
      // Make HTML element
      const historyItem = $("<input>");

      // Set attributes for the element
      historyItem.attr("type", "text");
      historyItem.attr("readonly", true);
      historyItem.attr("class", "form-control d-block bg-white");
      historyItem.attr("value", searchHistory[i]);

      // Load weather information for selected history item
      historyItem.on("click", function () {
        getWeather(historyItem.val());
      });

      // Append history item
      historyEl.append(historyItem);
    }
  }

  // Load search history
  genSeachHistory();

  // Display weather information for last item in search history
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }
});
