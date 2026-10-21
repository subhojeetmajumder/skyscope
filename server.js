const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const axios = require("axios");
require("dotenv").config();

const app = express();
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

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`SkyScope is running at http://localhost:${PORT}`);
});