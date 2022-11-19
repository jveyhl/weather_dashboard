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
    const currentUvEl = $("#uv-index");
    var fiveDayEl = $("#fiveday-header");

    // Get search history from localStorage or empty array
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // APIKey
    const APIKey = "3ddf8b774ef8c410e4f09e55de10f6b4";

    function getWeather(city) {
        // Create query url
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                // Make current conditions element visible
                currentWeatherEl[0].classList.remove("d-none")

                // Create date/time to place next to city name in current conditions
                const currentDate = dayjs().format("DD MMMM YYYY");

                // Display city name and current date im current conditions
                cityNameEl[0].innerHTML = `${data.name} ${currentDate}`;

                // Get the weather icon value
                let weatherIcon = data.weather[0].icon;
                // Set the <img> elements src attribute to get the icon image
                currentIconEl[0].setAttribute("src", `https://openweathermap.org/img/wn/${weatherIcon}.png`);

                // Set current temperture
                currentTempEl[0].innerHTML = `Temperature: ${tempConvert(data.main.temp).f} &#176F`;
                // Set current humidity
                currentHumEl[0].innerHTML = `Humidity: ${data.main.humidity}%`;
                // Set current wind speed
                currentWindEl[0].innerHTML = `Wind Speed: ${data.wind.speed} MPH`;

                console.log();
            })
            ;

        //console.log("from getWeather");
    }

    // Convert kelvin to celsius
    function tempConvert(temp) {
        // Create temperature object
        const allTemps = {
            k: temp,
            c: (temp - 273.15).toFixed(1),
            f: (1.8 * (temp - 273.15) + 32).toFixed(1)
        }
        return allTemps;
    }

    getWeather("montreal");
});