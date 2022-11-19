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
  var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // APIKey
  const APIKey = "3ddf8b774ef8c410e4f09e55de10f6b4";

  function getWeather(city) {
    // Create query url for current weather
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Make current conditions element visible
        currentWeatherEl[0].classList.remove("d-none");

        // Create date/time to place next to city name in current conditions
        const currentDate = dayjs().format("(D/M/YYYY)");

        // Display city name and current date im current conditions
        cityNameEl[0].innerHTML = `${data.name} ${currentDate}`;

        // Get the weather icon value
        let weatherIcon = data.weather[0].icon;
        // Set the <img> elements src attribute to get the icon image
        currentIconEl[0].setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${weatherIcon}.png`
        );

        // Set current temperture
        currentTempEl[0].innerHTML = `Temperature: ${tempConvert(data.main.temp).f} &#176F`;

        // Set current wind speed

        currentWindEl[0].innerHTML = `Wind Speed: ${data.wind.speed} MPH`;
        // Set current humidity
        currentHumEl[0].innerHTML = `Humidity: ${data.main.humidity}%`;

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
            fiveDayEl[0].classList.remove("d-none");

            // Store the updated forecastDate through each iteration of the loop
            let forecastDate;
            console.log(data.list);
            // Get forecast data and inject to HTML
            for (let i = 0; i < forecastEls.length; i++) {
              // Index for weather forecast data
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

              // Make an element to hold the forecast weather icon
              const forecastIconEl = document.createElement("img");

              // Get the forecast weather icon value
              let forecastWeatherIcon = data.list[forecastIndex].weather[0].icon;

              // Set the <img> elements src attribute to get the icon image
              forecastIconEl.setAttribute(
                "src",
                `https://openweathermap.org/img/wn/${forecastWeatherIcon}@2x.png`
              );

              // Append forecast weather icon
              forecastEls[i].append(forecastIconEl);

              // Make forecast temperature element and append
              const forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = `Temperature: ${tempConvert(data.list[forecastIndex].main.temp).f} &#176F`;
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

  getWeather("montreal");
});
