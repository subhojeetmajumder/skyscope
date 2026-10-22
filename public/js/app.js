const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", getCurrentLocation);

let map;
let mapMarker;
let pendingLocation = null;


// ===============================
// SEARCH WEATHER
// ===============================

searchBtn.addEventListener("click", searchWeather);

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});


// ===============================
// SEARCH FUNCTION
// ===============================

async function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        searchBtn.textContent = "Searching...";
        searchBtn.disabled = true;

        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        displayWeather(data);

        updateMap(
            data.latitude,
            data.longitude,
            `${data.city}, ${data.country}`
        );

    } catch (error) {

        console.error("Search error:", error);

        alert(error.message);

    } finally {

        searchBtn.textContent = "Search";
        searchBtn.disabled = false;

    }
}


// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(data) {

    document.getElementById("cityName").textContent =
        `${data.city}, ${data.country}`;

    document.getElementById("temperature").textContent =
        Math.round(data.temperature);

    document.getElementById("weatherDescription").textContent =
        capitalize(data.description);


    // Weather details

    document.getElementById("humidity").textContent =
        `${data.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind} m/s`;

    document.getElementById("feelsLike").textContent =
        `${Math.round(data.feelsLike)}°C`;

    document.getElementById("pressure").textContent =
        `${data.pressure} hPa`;

    document.getElementById("clouds").textContent =
        `${data.clouds}%`;


    // High / Low

    document.getElementById("maxTemperature").textContent =
        `${Math.round(data.maxTemperature)}°C`;

    document.getElementById("minTemperature").textContent =
        `${Math.round(data.minTemperature)}°C`;


    // Visibility

    const visibilityKm =
        (data.visibility / 1000).toFixed(1);

    document.getElementById("visibility").textContent =
        `${visibilityKm} km`;


    // Wind direction

    document.getElementById("windDirection").textContent =
        getWindDirection(data.windDirection);


    // Sunrise / Sunset

    document.getElementById("sunrise").textContent =
        formatTime(data.sunrise);

    document.getElementById("sunset").textContent =
        formatTime(data.sunset);


    // Weather icon

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    document.getElementById("weatherIcon").alt =
        data.description;


    // Forecast
fetchForecast(data.city);

displayWeatherInsights(data);

displayWeatherScore(data);
displayWeatherAlerts(data);
generateAIWeatherBriefing(data.city);
}


// ===============================
// GOOGLE MAP
// ===============================

async function initMap() {

    const { Map } =
        await google.maps.importLibrary("maps");

    const { AdvancedMarkerElement } =
        await google.maps.importLibrary("marker");


    const defaultLocation = {
        lat: 22.5726,
        lng: 88.3639
    };


    map = new Map(
    document.getElementById("map"),
    {
        center: defaultLocation,
        zoom: 10,
        mapId: "DEMO_MAP_ID"
    }
);


// ==========================================
// CLICK MAP TO GET WEATHER
// ==========================================

map.addListener("click", async (event) => {

    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    console.log(
        "Map clicked:",
        latitude,
        longitude
    );

    await getWeatherFromMap(
        latitude,
        longitude
    );

});


    mapMarker = new AdvancedMarkerElement({
        map: map,
        position: defaultLocation,
        title: "Kolkata"
    });


    if (pendingLocation) {

        updateMap(
            pendingLocation.lat,
            pendingLocation.lng,
            pendingLocation.title
        );

        pendingLocation = null;

    }
}


// ===============================
// UPDATE MAP
// ===============================

function updateMap(latitude, longitude, title) {

    const location = {
        lat: Number(latitude),
        lng: Number(longitude)
    };


    if (!map || !mapMarker) {

        pendingLocation = {
            lat: location.lat,
            lng: location.lng,
            title: title
        };

        return;
    }


    map.setCenter(location);

    map.setZoom(10);

    mapMarker.position = location;

    mapMarker.title = title;
}


// ===============================
// CAPITALIZE TEXT
// ===============================

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


// ===============================
// START GOOGLE MAP
// ===============================

window.addEventListener("load", () => {

    if (window.google && google.maps) {
        // initMap(); // Temporarily disabled while Google Maps is unavailable
    }

});


// ===============================
// CURRENT LOCATION
// ===============================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    locationBtn.textContent =
        "📍 Finding location...";

    locationBtn.disabled = true;


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response = await fetch(
                    `/api/weather/location?lat=${latitude}&lon=${longitude}`
                );

                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(data.error);
                }


                displayWeather(data);


                cityInput.value =
                    data.city;

function updateMap(latitude, longitude, title) {
  // Keep all your original function code here.

  if (!window.google || !window.google.maps || !map) {
    return;
  }

if (!window.google || !window.google.maps || !map) {
  return;
}
  updateMap(
    data.latitude,
    data.longitude,
    `${data.city}, ${data.country}`
  );
}

            } catch (error) {

                console.error(
                    "Location weather error:",
                    error
                );

                alert(error.message);


            } finally {

                locationBtn.textContent =
                    "📍 Use My Location";

                locationBtn.disabled = false;

            }

        },


        (error) => {

            console.error(
                "Location error:",
                error
            );


            if (error.code === 1) {

                alert(
                    "Location permission was denied. Please allow location access in your browser."
                );

            } else if (error.code === 2) {

                alert(
                    "Your location could not be determined."
                );

            } else if (error.code === 3) {

                alert(
                    "Location request timed out. Please try again."
                );

            } else {

                alert(
                    "Unable to get your current location."
                );

            }


            locationBtn.textContent =
                "📍 Use My Location";

            locationBtn.disabled = false;

        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }

    );

}


// ===============================
// 5 DAY FORECAST
// ===============================

async function fetchForecast(city) {

    const forecastContainer =
        document.getElementById("forecastContainer");


    try {

        forecastContainer.innerHTML =
            "<p>Loading forecast...</p>";


        const response = await fetch(
            `/api/forecast?city=${encodeURIComponent(city)}`
        );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(data.error);
        }


        displayForecast(data);


    } catch (error) {

        console.error(
            "Forecast error:",
            error
        );


        forecastContainer.innerHTML =
            `<p>${error.message}</p>`;

    }

}


// ===============================
// DISPLAY FORECAST
// ===============================

function displayForecast(data) {
        displayHourlyForecast(data);
displayForecastAlerts(data);
displayWeatherTrends(data);
    const forecastContainer =
        document.getElementById("forecastContainer");


    forecastContainer.innerHTML = "";


    const dailyForecast = {};


    data.list.forEach(item => {

        const date =
            new Date(item.dt * 1000);


        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        if (!dailyForecast[day]) {
            dailyForecast[day] = item;
        }

    });


    Object.values(dailyForecast)
        .slice(0, 5)
        .forEach(item => {

            const date =
                new Date(item.dt * 1000);


            const day =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long"
                    }
                );


            const icon =
                `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;


            const card =
                document.createElement("div");


            card.className =
                "forecast-card";


            card.innerHTML = `
                <h3>${day}</h3>

                <img
                    src="${icon}"
                    alt="${item.weather[0].description}"
                >

                <h2>
                    ${Math.round(item.main.temp)}°C
                </h2>

                <p>
                    ${capitalize(item.weather[0].description)}
                </p>

                <p>
                    💧 ${item.main.humidity}%
                </p>
            `;


            forecastContainer.appendChild(card);

        });

}


// ===============================
// WIND DIRECTION
// ===============================

function getWindDirection(degrees) {

    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"
    ];


    const index =
        Math.round(degrees / 45) % 8;


    return `${directions[index]} (${Math.round(degrees)}°)`;
}


// ===============================
// FORMAT TIME
// ===============================

function formatTime(timestamp) {

    const date =
        new Date(timestamp * 1000);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );
}
// ===============================
// HOURLY FORECAST
// ===============================

function displayHourlyForecast(data) {

    const hourlyContainer =
        document.getElementById("hourlyContainer");

    hourlyContainer.innerHTML = "";


    // Show the next 8 forecast periods
    const hourlyData =
        data.list.slice(0, 8);


    hourlyData.forEach(item => {

        const date =
            new Date(item.dt * 1000);


        const time =
    date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );


        const icon =
            `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;


        const card =
            document.createElement("div");


        card.className =
            "hourly-card";


        card.innerHTML = `
            <p class="hourly-time">
                ${time}
            </p>

            <img
                src="${icon}"
                alt="${item.weather[0].description}"
            >

            <h3>
                ${Math.round(item.main.temp)}°C
            </h3>

            <p class="hourly-condition">
                ${capitalize(item.weather[0].description)}
            </p>

            <p>
                💧 ${item.main.humidity}%
            </p>
        `;


        hourlyContainer.appendChild(card);

    });

}
// ==========================================
// GET WEATHER FROM MAP CLICK
// ==========================================

async function getWeatherFromMap(latitude, longitude) {

    try {

        // Show loading state
        document.getElementById("cityName").textContent =
            "Loading location...";


        const response = await fetch(
            `/api/weather/map?lat=${latitude}&lon=${longitude}`
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.error);
        }


        // Update weather information
        displayWeather(data);


        // Update search box
        cityInput.value = data.city;


        // Move marker
        updateMap(
            data.latitude,
            data.longitude,
            `${data.city}, ${data.country}`
        );


    } catch (error) {

        console.error(
            "Map weather error:",
            error
        );

        alert(
            "Unable to get weather for this location."
        );

    }

}
// ==========================================
// SKYSCOPE WEATHER INTELLIGENCE
// ==========================================

function generateWeatherInsights(data) {

    const insights = [];


    // ==========================================
    // TEMPERATURE INSIGHT
    // ==========================================

    if (data.temperature >= 35) {

        insights.push({
            icon: "🔥",
            title: "High Temperature",
            message:
                "The current temperature is very high. Stay hydrated and limit prolonged exposure to the heat."
        });

    } else if (data.temperature <= 10) {

        insights.push({
            icon: "🥶",
            title: "Cold Conditions",
            message:
                "The temperature is quite low. Consider wearing appropriate warm clothing."
        });

    } else {

        insights.push({
            icon: "🌡️",
            title: "Temperature",
            message:
                "The current temperature is within a moderate range."
        });

    }


    // ==========================================
    // HUMIDITY INSIGHT
    // ==========================================

    if (data.humidity >= 80) {

        insights.push({
            icon: "💧",
            title: "High Humidity",
            message:
                "Humidity is high, so the weather may feel warmer and more uncomfortable than the actual temperature."
        });

    } else if (data.humidity <= 30) {

        insights.push({
            icon: "🏜️",
            title: "Low Humidity",
            message:
                "The air is relatively dry compared with typical humid conditions."
        });

    }


    // ==========================================
    // CLOUD INSIGHT
    // ==========================================

    if (data.clouds >= 80) {

        insights.push({
            icon: "☁️",
            title: "Heavy Cloud Cover",
            message:
                "A large portion of the sky is currently covered by clouds."
        });

    } else if (data.clouds <= 20) {

        insights.push({
            icon: "☀️",
            title: "Clear Skies",
            message:
                "Cloud coverage is low and skies are relatively clear."
        });

    }


    // ==========================================
    // VISIBILITY INSIGHT
    // ==========================================

    const visibilityKm =
        data.visibility / 1000;


    if (visibilityKm < 3) {

        insights.push({
            icon: "⚠️",
            title: "Low Visibility",
            message:
                "Visibility is currently low. Extra caution may be useful when travelling."
        });

    } else {

        insights.push({
            icon: "👁️",
            title: "Good Visibility",
            message:
                "Visibility is currently at a relatively good level."
        });

    }


    return insights;
}
// ==========================================
// DISPLAY SKYSCOPE INSIGHTS
// ==========================================

function displayWeatherInsights(data) {

    const container =
        document.getElementById("insightsContainer");

    const insights =
        generateWeatherInsights(data);


    container.innerHTML = "";


    insights.forEach(insight => {

        const card =
            document.createElement("div");


        card.className =
            "insight-card";


        card.innerHTML = `
            <div class="insight-icon">
                ${insight.icon}
            </div>

            <h3>
                ${insight.title}
            </h3>

            <p>
                ${insight.message}
            </p>
        `;


        container.appendChild(card);

    });

}

// ==========================================
// SKYSCOPE WEATHER SCORE ENGINE
// ==========================================

function calculateWeatherScore(data) {
    let score = 100;

    const temperature = Number(data.temperature);
    const humidity = Number(data.humidity);
    const wind = Number(data.wind);
    const visibility = Number(data.visibility);
    const clouds = Number(data.clouds);
    const description = (data.description || "").toLowerCase();

    // TEMPERATURE
    if (temperature >= 40 || temperature <= 0) {
        score -= 35;
    } else if (temperature >= 35 || temperature <= 10) {
        score -= 25;
    } else if (temperature >= 30 || temperature <= 15) {
        score -= 10;
    }

    // HUMIDITY
    if (humidity >= 85) {
        score -= 15;
    } else if (humidity >= 70) {
        score -= 8;
    } else if (humidity < 25) {
        score -= 10;
    }

    // WIND SPEED (m/s)
    if (wind >= 15) {
        score -= 30;
    } else if (wind >= 10) {
        score -= 20;
    } else if (wind >= 6) {
        score -= 10;
    }

    // VISIBILITY (metres)
    if (visibility < 1000) {
        score -= 25;
    } else if (visibility < 5000) {
        score -= 12;
    }

    // CLOUD COVER
    if (clouds >= 90) {
        score -= 5;
    }

    // WEATHER CONDITIONS
    if (description.includes("thunderstorm")) {
        score -= 35;
    } else if (
        description.includes("rain") ||
        description.includes("drizzle") ||
        description.includes("snow")
    ) {
        score -= 20;
    }

    return Math.max(0, Math.min(100, score));
}


// ==========================================
// DISPLAY WEATHER SCORE
// ==========================================

function displayWeatherScore(data) {
    const score = calculateWeatherScore(data);

    const scoreElement = document.getElementById("weatherScore");
    const titleElement = document.getElementById("scoreTitle");
    const messageElement = document.getElementById("scoreMessage");
    const circleElement = document.querySelector(".score-circle");

    if (!scoreElement || !titleElement || !messageElement || !circleElement) {
        return;
    }

    scoreElement.textContent = score;

    let title;
    let message;
    let color;

    if (score >= 80) {
        title = "Excellent Conditions";
        message = "Current weather conditions appear comfortable for many outdoor activities.";
        color = "#22c55e";

    } else if (score >= 60) {
        title = "Good Conditions";
        message = "Generally suitable for outdoor activities, with some weather-related discomfort possible.";
        color = "#84cc16";

    } else if (score >= 40) {
        title = "Moderate Conditions";
        message = "Some conditions may affect outdoor comfort. Check the weather details before heading out.";
        color = "#f59e0b";

    } else {
        title = "Poor Conditions";
        message = "Current weather conditions may be uncomfortable or disruptive for outdoor activities.";
        color = "#ef4444";
    }

    titleElement.textContent = title;
    messageElement.textContent = message;

    circleElement.style.borderColor = color;
    circleElement.style.backgroundColor = `${color}15`;
}

/* ==========================================
   SKYSCOPE CITY COMPARISON
========================================== */

const compareBtn = document.getElementById("compareBtn");

compareBtn.addEventListener("click", compareCities);

// Allow Enter to trigger comparison
document.getElementById("cityOneInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") compareCities();
});

document.getElementById("cityTwoInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") compareCities();
});


async function compareCities() {
    const cityOne = document.getElementById("cityOneInput").value.trim();
    const cityTwo = document.getElementById("cityTwoInput").value.trim();
    const resultContainer = document.getElementById("comparisonResult");

    if (!cityOne || !cityTwo) {
        resultContainer.textContent = "Please enter both city names.";
        return;
    }

    if (cityOne.toLowerCase() === cityTwo.toLowerCase()) {
        resultContainer.textContent = "Please enter two different cities.";
        return;
    }

    compareBtn.disabled = true;
    compareBtn.textContent = "Comparing...";
    resultContainer.textContent = "Fetching weather for both cities...";

    try {
        const [responseOne, responseTwo] = await Promise.all([
            fetch(`/api/weather?city=${encodeURIComponent(cityOne)}`),
            fetch(`/api/weather?city=${encodeURIComponent(cityTwo)}`)
        ]);

        const [dataOne, dataTwo] = await Promise.all([
            responseOne.json(),
            responseTwo.json()
        ]);

        if (!responseOne.ok) {
            throw new Error(`${cityOne}: ${dataOne.error || "Weather unavailable."}`);
        }

        if (!responseTwo.ok) {
            throw new Error(`${cityTwo}: ${dataTwo.error || "Weather unavailable."}`);
        }

        displayCityComparison(dataOne, dataTwo);

    } catch (error) {
        resultContainer.textContent = error.message;
    } finally {
        compareBtn.disabled = false;
        compareBtn.textContent = "Compare Cities";
    }
}


function displayCityComparison(cityOne, cityTwo) {
    const container = document.getElementById("comparisonResult");

    container.replaceChildren();

    const cities = [cityOne, cityTwo];

    cities.forEach(city => {
        const card = document.createElement("div");
        card.className = "comparison-card";

        const score = calculateWeatherScore(city);
        const iconUrl =
            `https://openweathermap.org/img/wn/${city.icon}@2x.png`;

        const heading = document.createElement("h3");
        heading.textContent = `${city.city}, ${city.country}`;

        const icon = document.createElement("img");
        icon.src = iconUrl;
        icon.alt = city.description;
        icon.width = 80;
        icon.height = 80;

        const temperature = document.createElement("div");
        temperature.className = "comparison-temperature";
        temperature.textContent = `${Math.round(city.temperature)}°C`;

        const description = document.createElement("p");
        description.textContent =
            city.description.charAt(0).toUpperCase() +
            city.description.slice(1);

        const details = document.createElement("div");

        [
            `Feels like: ${Math.round(city.feelsLike)}°C`,
            `Humidity: ${city.humidity}%`,
            `Wind speed: ${city.wind} m/s`,
            `Cloud cover: ${city.clouds}%`
        ].forEach(text => {
            const line = document.createElement("p");
            line.textContent = text;
            details.appendChild(line);
        });

        const scoreBox = document.createElement("div");
        scoreBox.className = "comparison-score";
        scoreBox.textContent = `Weather Score: ${score}/100`;

        card.append(
            heading,
            icon,
            temperature,
            description,
            details,
            scoreBox
        );

        container.appendChild(card);
    });

    
    // Overall comparison based on the custom score
    const scoreOne = calculateWeatherScore(cityOne);
    const scoreTwo = calculateWeatherScore(cityTwo);

    const summary = document.createElement("p");
    summary.style.gridColumn = "1 / -1";
    summary.style.textAlign = "center";
    summary.style.fontWeight = "bold";
    summary.style.lineHeight = "1.6";

    if (scoreOne > scoreTwo) {
        summary.textContent =
            `${cityOne.city} has the higher outdoor-comfort score (${scoreOne} vs ${scoreTwo}).`;
    } else if (scoreTwo > scoreOne) {
        summary.textContent =
            `${cityTwo.city} has the higher outdoor-comfort score (${scoreTwo} vs ${scoreOne}).`;
    } else {
        summary.textContent =
            `Both cities have the same outdoor-comfort score: ${scoreOne}/100.`;
    }

    container.appendChild(summary);
}

/* ==========================================
   SKYSCOPE SMART WEATHER ALERTS
========================================== */

function generateWeatherAlerts(data) {
    const alerts = [];
    const temperature = Number(data.temperature);
    const humidity = Number(data.humidity);
    const wind = Number(data.wind);
    const visibility = Number(data.visibility);
    const description = (data.description || "").toLowerCase();

    // EXTREME HEAT
    if (temperature >= 40) {
        alerts.push({
            icon: "🔥",
            title: "Extreme Heat",
            message: "Temperature is extremely high. Avoid prolonged heat exposure and stay hydrated.",
            type: "danger"
        });
    } else if (temperature >= 35) {
        alerts.push({
            icon: "🌡️",
            title: "High Temperature",
            message: "It's very hot. Drink water regularly and take breaks in cooler areas.",
            type: "warning"
        });
    }

    // HIGH HUMIDITY
    if (humidity >= 85) {
        alerts.push({
            icon: "💧",
            title: "High Humidity",
            message: "High humidity may increase discomfort, especially during physical activity.",
            type: "warning"
        });
    }

    // STRONG WIND
    if (wind >= 15) {
        alerts.push({
            icon: "🌬️",
            title: "Very Strong Wind",
            message: "Wind speeds are very high. Take care around exposed areas and loose objects.",
            type: "danger"
        });
    } else if (wind >= 10) {
        alerts.push({
            icon: "💨",
            title: "Strong Wind",
            message: "Strong winds may affect outdoor activities.",
            type: "warning"
        });
    }

    // LOW VISIBILITY
    if (visibility < 1000) {
        alerts.push({
            icon: "🌫️",
            title: "Very Low Visibility",
            message: "Visibility is severely reduced. Use extra caution when travelling.",
            type: "danger"
        });
    } else if (visibility < 3000) {
        alerts.push({
            icon: "🌁",
            title: "Reduced Visibility",
            message: "Visibility is reduced. Allow extra care and time when travelling.",
            type: "warning"
        });
    }

    // CURRENT WEATHER CONDITIONS
    if (description.includes("thunderstorm")) {
        alerts.push({
            icon: "⛈️",
            title: "Thunderstorm Conditions",
            message: "Thunderstorms are currently reported. Seek shelter indoors and avoid exposed areas.",
            type: "danger"
        });
    } else if (
        description.includes("rain") ||
        description.includes("drizzle")
    ) {
        alerts.push({
            icon: "🌧️",
            title: "Rain Reported",
            message: "Rain is currently reported. Consider carrying an umbrella when going outside.",
            type: "warning"
        });
    } else if (description.includes("snow")) {
        alerts.push({
            icon: "❄️",
            title: "Snow Reported",
            message: "Snow is currently reported. Check local conditions before travelling.",
            type: "warning"
        });
    }

    // NO ALERTS
    if (alerts.length === 0) {
        alerts.push({
            icon: "✅",
            title: "No Significant Alerts",
            message: "No conditions crossed SkyScope's current alert thresholds. Continue to check local weather updates.",
            type: "positive"
        });
    }

    return alerts;
}


// ==========================================
// DISPLAY SMART WEATHER ALERTS
// ==========================================

function displayWeatherAlerts(data) {
    const container = document.getElementById("alertsContainer");

    if (!container) return;

    const alerts = generateWeatherAlerts(data);

    container.replaceChildren();

    alerts.forEach(alert => {
        const card = document.createElement("div");
        card.className = `alert-card alert-${alert.type}`;

        const icon = document.createElement("span");
        icon.className = "alert-icon";
        icon.textContent = alert.icon;

        const content = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = alert.title;

        const message = document.createElement("p");
        message.textContent = alert.message;

        content.append(heading, message);
        card.append(icon, content);
        container.appendChild(card);
    });
}

/* ==========================================
   SKYSCOPE FORECAST-BASED RAIN ALERTS
========================================== */

function displayForecastAlerts(forecastData) {
    const container = document.getElementById("alertsContainer");

    if (!container || !Array.isArray(forecastData.list)) {
        return;
    }

    // Remove forecast alerts from the previous city search.
    container.querySelectorAll(".forecast-alert-card").forEach(card => {
        card.remove();
    });

    // Check the next 8 forecast periods (approximately 24 hours).
    const upcoming = forecastData.list.slice(0, 8);

    const rainEntries = upcoming.filter(item => {
        const condition = item.weather?.[0]?.main?.toLowerCase() || "";
        return condition === "rain" || condition === "drizzle";
    });

    const stormEntries = upcoming.filter(item => {
        const condition = item.weather?.[0]?.main?.toLowerCase() || "";
        return condition === "thunderstorm";
    });

    function getCityForecastTime(item) {
        const offset = forecastData.city?.timezone || 0;

        // Convert the timestamp to the forecast city's local time.
        const cityDate = new Date((item.dt + offset) * 1000);

        return cityDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC"
        });
    }

    function addForecastAlert(icon, title, message, type) {
        const card = document.createElement("div");
        card.className = `alert-card alert-${type} forecast-alert-card`;

        const symbol = document.createElement("span");
        symbol.className = "alert-icon";
        symbol.textContent = icon;

        const content = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = title;

        const description = document.createElement("p");
        description.textContent = message;

        content.append(heading, description);
        card.append(symbol, content);
        container.appendChild(card);
    }

    if (stormEntries.length > 0) {
        const firstStorm = stormEntries[0];

        addForecastAlert(
            "⛈️",
            "Thunderstorm Forecast",
            `Thunderstorms may occur around ${getCityForecastTime(firstStorm)}. Check local updates and plan accordingly.`,
            "danger"
        );
    }

    if (rainEntries.length > 0) {
        const firstRain = rainEntries[0];

        addForecastAlert(
            "🌧️",
            "Rain Expected",
            `Rain or drizzle may occur around ${getCityForecastTime(firstRain)}. Consider carrying an umbrella.`,
            "warning"
        );
    }

    if (rainEntries.length === 0 && stormEntries.length === 0) {
        addForecastAlert(
            "🌤️",
            "No Rain Detected in the Next 24 Hours",
            "The available forecast periods show no rain or thunderstorms. Conditions can change, so check updates before travelling.",
            "positive"
        );
    }
}

/* ==========================================
   SKYSCOPE WEATHER TREND CHARTS
========================================== */

let temperatureChartInstance = null;
let humidityChartInstance = null;

function displayWeatherTrends(forecastData) {
    const temperatureCanvas =
        document.getElementById("temperatureChart");

    const humidityCanvas =
        document.getElementById("humidityChart");

    // Exit safely if the chart section is unavailable.
    if (
        !temperatureCanvas ||
        !humidityCanvas ||
        typeof Chart === "undefined"
    ) {
        console.error("Weather charts or Chart.js are unavailable.");
        return;
    }

    if (!Array.isArray(forecastData.list)) {
        return;
    }

    // Use the next 8 forecast entries (approximately 24 hours).
    const upcoming = forecastData.list.slice(0, 8);

    const labels = upcoming.map(item =>
        new Date(item.dt * 1000).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        })
    );

    const temperatures = upcoming.map(item =>
        Number(item.main.temp)
    );

    const humidities = upcoming.map(item =>
        Number(item.main.humidity)
    );

    // Destroy previous charts before creating new ones.
    if (temperatureChartInstance) {
        temperatureChartInstance.destroy();
    }

    if (humidityChartInstance) {
        humidityChartInstance.destroy();
    }

    // TEMPERATURE CHART
    temperatureChartInstance = new Chart(temperatureCanvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Temperature (°C)",
                data: temperatures,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.12)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    title: {
                        display: true,
                        text: "Temperature (°C)"
                    }
                },

                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });

    // HUMIDITY CHART
    humidityChartInstance = new Chart(humidityCanvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Humidity (%)",
                data: humidities,
                borderColor: "#0891b2",
                backgroundColor: "rgba(8, 145, 178, 0.12)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Humidity (%)"
                    }
                },

                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
}

/* ==========================================
   SKYSCOPE FAVOURITE CITIES
========================================== */

const favouriteCityInput =
    document.getElementById("favouriteCityInput");

const addFavouriteBtn =
    document.getElementById("addFavouriteBtn");

const favouritesContainer =
    document.getElementById("favouritesContainer");

const FAVOURITES_STORAGE_KEY = "skyscopeFavouriteCities";

let favouriteCities = loadFavouriteCities();


// LOAD SAVED CITIES
function loadFavouriteCities() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(FAVOURITES_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return saved.filter(
            city => typeof city === "string" && city.trim() !== ""
        );
    } catch (error) {
        console.error("Unable to load favourite cities:", error);
        return [];
    }
}


// SAVE CITIES TO BROWSER STORAGE
function saveFavouriteCities() {
    try {
        localStorage.setItem(
            FAVOURITES_STORAGE_KEY,
            JSON.stringify(favouriteCities)
        );

        return true;
    } catch (error) {
        console.error("Unable to save favourite cities:", error);
        alert("Unable to save favourites in this browser.");
        return false;
    }
}


// ADD A FAVOURITE
addFavouriteBtn.addEventListener("click", addFavouriteCity);

favouriteCityInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addFavouriteCity();
    }
});

async function addFavouriteCity() {
    const city = favouriteCityInput.value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    if (
        favouriteCities.some(
            saved => saved.toLowerCase() === city.toLowerCase()
        )
    ) {
        alert("This city is already in your favourites.");
        return;
    }

    addFavouriteBtn.disabled = true;
    addFavouriteBtn.textContent = "Checking...";

    try {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to find this city.");
        }

        // Store the API's normalized city name.
        const cityName = data.city;

        if (
            favouriteCities.some(
                saved => saved.toLowerCase() === cityName.toLowerCase()
            )
        ) {
            alert("This city is already in your favourites.");
            return;
        }

        favouriteCities.push(cityName);

        if (saveFavouriteCities()) {
            favouriteCityInput.value = "";
            renderFavouriteCities();
        } else {
            favouriteCities.pop();
        }

    } catch (error) {
        alert(error.message || "Unable to add this city.");
    } finally {
        addFavouriteBtn.disabled = false;
        addFavouriteBtn.textContent = "+ Add City";
    }
}


// DISPLAY FAVOURITE CITIES
function renderFavouriteCities() {
    favouritesContainer.replaceChildren();

    if (favouriteCities.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No favourite cities saved yet.";
        favouritesContainer.appendChild(message);
        return;
    }

    favouriteCities.forEach(city => {
        const card = document.createElement("div");
        card.className = "favourite-card";

        const heading = document.createElement("h3");
        heading.textContent = `📍 ${city}`;

        const description = document.createElement("p");
        description.textContent = "Saved city";

        const actions = document.createElement("div");
        actions.className = "favourite-actions";

        const openButton = document.createElement("button");
        openButton.className = "favourite-open";
        openButton.textContent = "View Weather";
        openButton.addEventListener("click", () => {
            cityInput.value = city;
            searchWeather();
        });

        const removeButton = document.createElement("button");
        removeButton.className = "favourite-remove";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            removeFavouriteCity(city);
        });

        actions.append(openButton, removeButton);
        card.append(heading, description, actions);
        favouritesContainer.appendChild(card);
    });
}


// REMOVE A FAVOURITE
function removeFavouriteCity(city) {
    favouriteCities = favouriteCities.filter(
        saved => saved.toLowerCase() !== city.toLowerCase()
    );

    if (saveFavouriteCities()) {
        renderFavouriteCities();
    }
}


// LOAD FAVOURITES WHEN THE APP STARTS
renderFavouriteCities();

async function generateAIWeatherBriefing(city) {
  const status = document.getElementById("aiBriefingStatus");
  const output = document.getElementById("aiBriefingText");

  if (!status || !output || !city) return;

  status.textContent = `Preparing your briefing for ${city}…`;
  output.textContent = "";

  try {
    const response = await fetch("/api/ai-briefing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ city })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to generate the briefing."
      );
    }

    status.textContent = `AI weather briefing · ${result.city}`;
    // Use textContent, not innerHTML, for untrusted model output.
    output.textContent = result.briefing;
  } catch (error) {
    status.textContent = "AI briefing temporarily unavailable.";
    output.textContent =
      error.message ||
      "Please try again after checking your connection and API settings.";
  }
}
