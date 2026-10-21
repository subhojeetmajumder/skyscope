# 🌤️ SkyScope — Weather Intelligence Platform

SkyScope is an interactive weather web application that combines real-time weather data, Google Maps, forecasts, and rule-based weather insights in one dashboard.

## ✨ Features

- **Real-Time Weather:** Search for cities and view current weather conditions.
- **Geolocation:** Check weather for your current location.
- **Interactive Google Maps:** Select map locations to explore their weather.
- **Weather Insights:** Analyze current conditions using rule-based logic.
- **Weather Score:** Calculate an indicative outdoor-comfort score out of 100.
- **City Comparison:** Compare weather conditions and scores between two cities.
- **Smart Weather Alerts:** Identify notable current conditions and forecast rain or thunderstorms.
- **Hourly Forecast:** Explore upcoming forecast periods.
- **5-Day Forecast:** View upcoming weather conditions.
- **Weather Trend Charts:** Visualize temperature and humidity trends.
- **Favourite Cities:** Save frequently checked cities in your browser.

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Handlebars
- **Backend:** Node.js, Express.js
- **APIs:** OpenWeather API, Google Maps JavaScript API
- **Charts:** Chart.js
- **HTTP Client:** Axios
- **Configuration:** dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- An OpenWeather API key
- A Google Maps API key with the Maps JavaScript API enabled

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/skyscope.git
   ```

2. Enter the project directory:

   ```bash
   cd skyscope
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root:

   ```env
   WEATHER_API_KEY=your_openweather_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. Start the application:

   ```bash
   node server.js
   ```

6. Open `http://localhost:3000` in your browser.

## 🔐 Security

- Keep `.env` out of version control.
- Never commit secret API keys.
- Restrict the Google Maps browser key to the required API and authorized websites.
- Configure appropriate usage restrictions for your OpenWeather API key.

## 📌 Notes

SkyScope's Weather Score and rule-based alerts are indicative application features, not official safety ratings or emergency warnings. Forecast accuracy and availability depend on the weather API.

## 👨‍💻 Project

**SkyScope** — An interactive weather intelligence project built with Node.js, Express.js, JavaScript, Handlebars, and external APIs.