$(document).ready(() => {

    // Search/History Elements
    const searchCityEl = $("#search-city");
    const searchBtnEl = $("#search-button");
    const clearBtnEl = $("#clear-history");
    const historyEl = $("#history");

    // Display Results Elements
    var currentWeatherEl = $("#current-weather");
    const cityNameEl = $("#city-name");
    const currentImgEl = $("#current-img");
    const currentTempEl = $("#temperature");
    const currentHumEl = $("#humidity");
    const currentWindEl = $("#wind-speed");
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
                console.log(data);
                
                // Display date/time next to city name in current conditions
                const currentDate = dayjs().format("DD MMMM YYYY h:mm A"); 

                console.log(currentDate);
            })
            ;

        console.log("from getWeather");
    }

    getWeather("montreal");
});