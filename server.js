const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const axios = require("axios");
require("dotenv").config();


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// ==========================================
// HANDLEBARS SETUP
// ==========================================

app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: false
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ==========================================
// SERVE CSS AND JAVASCRIPT
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.render("index", {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
});

// ==========================================
// CURRENT WEATHER BY CITY
// ==========================================

app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;

        // Check if city was provided
        if (!city) {
            return res.status(400).json({
                error: "Please provide a city name."
            });
        }

        // Request weather from OpenWeather
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    q: city,
                    appid: process.env.WEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

        const data = response.data;

        // Send weather information to frontend
        res.json({
            city: data.name,
            country: data.sys.country,
temperature: data.main.temp,
feelsLike: data.main.feels_like,
minTemperature: data.main.temp_min,
maxTemperature: data.main.temp_max,
humidity: data.main.humidity,
pressure: data.main.pressure,
            wind: data.wind.speed,
            windDirection: data.wind.deg,

            visibility: data.visibility,
            clouds: data.clouds.all,

            description: data.weather[0].description,
            icon: data.weather[0].icon,

            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,

            latitude: data.coord.lat,
            longitude: data.coord.lon
        });

    } catch (error) {

        console.error(
            "Weather API Error:",
            error.response?.data || error.message
        );

        if (error.response?.status === 404) {
            return res.status(404).json({
                error: "City not found."
            });
        }

        res.status(500).json({
            error: "Unable to fetch weather data."
        });
    }
});

// ==========================================
// CURRENT WEATHER BY LOCATION
// ==========================================

app.get("/api/weather/location", async (req, res) => {

    try {

        const { lat, lon } = req.query;

        // Check coordinates
        if (!lat || !lon) {
            return res.status(400).json({
                error: "Latitude and longitude are required."
            });
        }

        // Request weather using coordinates
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: process.env.WEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

        const data = response.data;

        // Send weather information to frontend
        res.json({
            city: data.name,
            country: data.sys.country,

           temperature: data.main.temp,
feelsLike: data.main.feels_like,
minTemperature: data.main.temp_min,
maxTemperature: data.main.temp_max,
humidity: data.main.humidity,
pressure: data.main.pressure,
            wind: data.wind.speed,
            windDirection: data.wind.deg,

            visibility: data.visibility,
            clouds: data.clouds.all,

            description: data.weather[0].description,
            icon: data.weather[0].icon,

            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,

            latitude: data.coord.lat,
            longitude: data.coord.lon
        });

    } catch (error) {

        console.error(
            "Location Weather API Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "Unable to fetch weather for your location."
        });
    }
});
// ==========================================
// WEATHER BY MAP COORDINATES
// ==========================================

app.get("/api/weather/map", async (req, res) => {

    try {

        const { lat, lon } = req.query;

        // Check coordinates
        if (!lat || !lon) {
            return res.status(400).json({
                error: "Latitude and longitude are required."
            });
        }

        // Request weather using map coordinates
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: process.env.WEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

        const data = response.data;

        // Send weather information to frontend
        res.json({
            city: data.name,
            country: data.sys.country,

            temperature: data.main.temp,
            feelsLike: data.main.feels_like,

            minTemperature: data.main.temp_min,
            maxTemperature: data.main.temp_max,

            humidity: data.main.humidity,
            pressure: data.main.pressure,

            wind: data.wind.speed,
            windDirection: data.wind.deg,

            visibility: data.visibility,
            clouds: data.clouds.all,

            description: data.weather[0].description,
            icon: data.weather[0].icon,

            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,

            latitude: data.coord.lat,
            longitude: data.coord.lon
        });

    } catch (error) {

        console.error(
            "Map Weather API Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "Unable to fetch weather for this location."
        });
    }
});
// ==========================================
// 5-DAY FORECAST
// ==========================================

app.get("/api/forecast", async (req, res) => {

    try {

        const city = req.query.city;

        // Check if city was provided
        if (!city) {
            return res.status(400).json({
                error: "Please provide a city name."
            });
        }

        // Request 5-day forecast from OpenWeather
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            {
                params: {
                    q: city,
                    appid: process.env.WEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

        // Send forecast data to frontend
        res.json(response.data);

    } catch (error) {

        console.error(
            "Forecast API Error:",
            error.response?.data || error.message
        );

        if (error.response?.status === 404) {
            return res.status(404).json({
                error: "City not found."
            });
        }

        res.status(500).json({
            error: "Unable to fetch forecast."
        });
    }
});

/* =========================================
   SKYSCOPE AI WEATHER BRIEFING
   ========================================= */


/* =========================================
   SKYSCOPE FREE WEATHER BRIEFING
   Rule-based JavaScript; no OpenAI API
   ========================================= */

app.post("/api/ai-briefing", async (req, res) => {
  try {
    const city =
      typeof req.body?.city === "string"
        ? req.body.city.trim()
        : "";

    if (!city || city.length > 100) {
      return res.status(400).json({
        error: "Please provide a valid city name."
      });
    }

    if (!process.env.WEATHER_API_KEY) {
      return res.status(503).json({
        error: "Weather service is not configured."
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.WEATHER_API_KEY,
          units: "metric"
        },
        timeout: 10000
      }
    );

    const w = response.data;
    const temperature = w.main?.temp;
    const feelsLike = w.main?.feels_like;
    const humidity = w.main?.humidity;
    const wind = w.wind?.speed;
    const description =
      w.weather?.[0]?.description || "conditions unavailable";
    const condition =
      w.weather?.[0]?.main?.toLowerCase() || "";
    const clouds = w.clouds?.all;

    if (
      typeof temperature !== "number" ||
      typeof humidity !== "number"
    ) {
      return res.status(502).json({
        error: "Weather data is incomplete. Please try again."
      });
    }

    // Describe the current temperature.
    let temperatureAdvice;

    if (temperature >= 35) {
      temperatureAdvice =
        "It is very hot. Limit strenuous outdoor activity and drink water regularly.";
    } else if (temperature >= 29) {
      temperatureAdvice =
        "It is warm to hot. Choose breathable clothing and take breaks in the shade.";
    } else if (temperature >= 20) {
      temperatureAdvice =
        "The temperature is generally comfortable for everyday activities.";
    } else if (temperature >= 10) {
      temperatureAdvice =
        "It is cool. Consider carrying a light jacket.";
    } else {
      temperatureAdvice =
        "It is cold. Wear warm layers when heading outside.";
    }

    // Describe humidity.
    let humidityAdvice;

    if (humidity >= 80) {
      humidityAdvice =
        "Humidity is high, so it may feel sticky or uncomfortable.";
    } else if (humidity >= 60) {
      humidityAdvice =
        "Humidity is moderately high; stay hydrated if you are active outdoors.";
    } else if (humidity <= 30) {
      humidityAdvice =
        "The air is relatively dry. Drink water regularly.";
    } else {
      humidityAdvice =
        "Humidity is at a moderate level.";
    }

    // Describe wind.
    let windAdvice;

    if (typeof wind !== "number") {
      windAdvice = "Wind information is unavailable.";
    } else if (wind >= 10.8) {
      windAdvice =
        "Winds are strong. Take care around exposed areas and loose objects.";
    } else if (wind >= 5.5) {
      windAdvice = "It is breezy outside.";
    } else {
      windAdvice = "Winds are relatively light.";
    }

    // Use only the reported current conditions.
    let conditionAdvice;

    if (
      condition.includes("thunderstorm")
    ) {
      conditionAdvice =
        "Thunderstorms are being reported. Consider staying indoors and checking local weather alerts.";
    } else if (
      condition.includes("rain") ||
      condition.includes("drizzle")
    ) {
      conditionAdvice =
        "Rain is being reported. Carry an umbrella and take care on slippery roads.";
    } else if (condition.includes("snow")) {
      conditionAdvice =
        "Snow is being reported. Take care on potentially slippery surfaces.";
    } else if (condition.includes("clear")) {
      conditionAdvice =
        "The sky is reported as clear. Consider sun protection during daytime outdoor activities.";
    } else if (
      condition.includes("cloud") ||
      condition.includes("mist") ||
      condition.includes("fog") ||
      condition.includes("haze")
    ) {
      conditionAdvice =
        "Reduced sunshine or visibility may affect outdoor plans. Check local conditions before travelling.";
    } else {
      conditionAdvice =
        "Check local conditions before making weather-sensitive plans.";
    }

    const briefing = [
      `Current conditions in ${w.name}: ${description}.`,
      `Temperature: ${Math.round(temperature)}°C` +
        (typeof feelsLike === "number"
          ? `, feels like ${Math.round(feelsLike)}°C.`
          : "."),
      temperatureAdvice,
      `Humidity is ${humidity}%. ${humidityAdvice}`,
      windAdvice,
      conditionAdvice,
      typeof clouds === "number"
        ? `Cloud cover: ${clouds}%.`
        : ""
    ]
      .filter(Boolean)
      .join("\n\n");

    return res.json({
      city: w.name,
      briefing,
      source: "OpenWeather current conditions"
    });
  } catch (error) {
    const status = error.response?.status;

    console.error("Free weather briefing error:", {
      status,
      message: error.message
    });

    if (status === 404) {
      return res.status(404).json({
        error: "City not found. Check the spelling and try again."
      });
    }

    if (status === 401) {
      return res.status(503).json({
        error: "Weather API authentication failed. Check your weather API settings."
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "The weather service request limit has been reached. Please try again later."
      });
    }

    return res.status(502).json({
      error: "Unable to generate the weather briefing right now."
    });
  }
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`SkyScope is running at http://localhost:${PORT}`);
});