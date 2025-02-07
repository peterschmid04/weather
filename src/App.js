import { useState } from "react";
import "./App.css";

export default function WeatherApp() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const apiKey = "2e014f18136b47b8bdedbe4efac8d619"; 

    const getWeatherData = async (city) => {
        try {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Could not fetch weather data");
            }

            const data = await response.json();
            setWeather({
                city: data.name,
                temp: (data.main.temp - 273.15).toFixed(1),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                emoji: getWeatherEmoji(data.weather[0].id),
            });
            setError("");
        } catch (error) {
            setWeather(null);
            setError("City not found or API issue!");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (city.trim()) {
            getWeatherData(city);
        } else {
            setError("Please enter a city!");
        }
    };

    const getWeatherEmoji = (weatherId) => {
      switch (true) {
          case weatherId >= 200 && weatherId < 300:
              return "⛈️"; // GewitterGewitter
          case weatherId >= 300 && weatherId < 400:
              return "🌧"; // Nieselregen
          case weatherId >= 500 && weatherId < 600:
              return "🌧"; // Regen
          case weatherId >= 600 && weatherId < 700:
            return "🌨️"; // Schnee 
          case weatherId >= 700 && weatherId < 800:
              return "🌫️"; // Nebel
          case weatherId === 800:
              return "🌤️"; // Klarer Himmel
          case weatherId >= 801 && weatherId < 810:
              return "🌥️"; // Bewölkt
          default:
              return "❓"; // Unbekanntes Wetter
      }
  };

  return (
    <div className="weather-grid">
      <form className="weatherForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="cityInput"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <p className="errorDisplay">{error}</p>}

      {weather && (
        <div className="card">
          <h1>{weather.city}</h1>
            <p>{weather.temp}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>{weather.description}</p>
            <p>{weather.emoji}</p>
        </div>
      )}
    </div>
  );
}