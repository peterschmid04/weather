import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Forecast from "./components/Forecast";
import Highlights from "./components/Highlights";
import Header from "./components/Header";

import { getWeatherImage, getWeatherIcons } from "./utils/weatherUtils";
import { getStatusUV, getStatusWind, getStatusVisibility, getStatusHumidity, getStatusAirquality } from "./utils/statusUtils";

export default function WeatherApp() {
    const [city, setCity] = useState("Lossburg");
    const [weather, setWeather] = useState(null);
    const [country, setCountry] = useState("");
    const [highlights, setHighlights] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState("");
    const [timezoneOffset, setTimezoneOffset] = useState(0);
    const [isCelsius, setIsCelsius] = useState(true);
    const [foundCity, setFoundCity] = useState(false);

    const timezoneOffsetFormatted = timezoneOffset >= 0 ? `+${timezoneOffset}` : timezoneOffset;

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    };

    const getCurrentDay = () => {
        const now = new Date();
        const options = { weekday: 'long' };
        return now.toLocaleDateString('de-DE', options);
    };

    const getNextSevenDays = () => {
        const days = [];
        const options = { weekday: 'short' };
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date.toLocaleDateString('de-DE', options));
        }
        return days;
    };

    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [currentDay, setCurrentDay] = useState(getCurrentDay());
    const [forecastDays, setForecastDays] = useState(getNextSevenDays());

    const apiKey = "2e014f18136b47b8bdedbe4efac8d619"; 

    const getWeatherData = useCallback(async (city) => {
        try {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Could not fetch weather data");
            }

            const data = await response.json();
            console.log(data); // Ausgabe der API-Antwort in der Konsole

            setCountry(data.sys.country);
            setTimezoneOffset(data.timezone / 3600);
            setFoundCity(data.name);

            setWeather({
                city: data.name,
                temp: (data.main.temp - 273.15).toFixed(1),
                humidity: data.main.humidity,
                visibility: data.visibility,
                description: data.weather[0].description,
                image: getWeatherImage(data.weather[0].id),
                icon: getWeatherIcons(data.weather[0].id),
            });         

            const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`;
            const uvResponse = await fetch(uvUrl);
            const uvData = await uvResponse.json();
            console.log(uvData); // Ausgabe der UV-Daten in der Konsole

            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

            const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`;
            const airQualityResponse = await fetch(airQualityUrl);
            const airQualityData = await airQualityResponse.json();
            // console.log(airQualityData); // Ausgabe der Luftqualitätsdaten in der Konsole

            const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            console.log(forecastData); // Ausgabe der Vorhersagedaten in der Konsole

            setForecastData(forecastData.daily.slice(1, 8).map((day, index) => ({
                day: forecastDays[index],
                image: getWeatherImage(day.weather[0].id),
                description: day.weather[0].description,
                tempMin: (day.temp.min - 273.15).toFixed(1),
                tempMax: (day.temp.max - 273.15).toFixed(1)
            })));

            setHighlights([
                { title: "UV Index", value: uvData.value, unit: "", status: getStatusUV(uvData.value) },
                { title: "Wind Status", value: data.wind.speed, unit: "km/h", status: getStatusWind(data.wind.speed) },
                { title: "Sunrise & Sunset", up: `${sunrise}`, down:`${sunset}`},
                { title: "Humidity", value: data.main.humidity, unit: "%", status : getStatusHumidity(data.main.humidity) },
                { title: "Visibility", value: (data.visibility / 1000).toFixed(1), unit: "", status: getStatusVisibility((data.visibility / 1000).toFixed(1)) },
                { title: "Air Quality", value: airQualityData.list[0].main.aqi, unit: "", status: getStatusAirquality(airQualityData.list[0].main.aqi) }, // Air quality index
            ]);
            setError("");
        } catch (error) {
            setWeather(null);
            setHighlights([]);
            setError("City not found or API issue!");
        }
    }, [apiKey, forecastDays]);

    useEffect(() => {
        getWeatherData("Lossburg"); // Abruf der Wetterdaten für Lossburg beim ersten Laden
    }, [getWeatherData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000); // Aktualisiert die Zeit jede Minute
        return () => clearInterval(interval); // Bereinigt das Intervall beim Demontieren der Komponente
    }, []);

    useEffect(() => {
        setCurrentDay(getCurrentDay());
    }, []);

    useEffect(() => {
        setForecastDays(getNextSevenDays());
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (city.trim()) {
            getWeatherData(city);
        } else {
            setError("Please enter a city!");
        }
    };

    const cityExists = weather && !error;

    return (
        <div className="weather-grid">
            <Sidebar
                city={city}
                setCity={setCity}
                handleSubmit={handleSubmit}
                weather={weather}
                currentDay={currentDay}
                currentTime={currentTime}
                isCelsius={isCelsius}
            /> 
            {cityExists && weather && (
                <Header 
                    foundCity={foundCity} 
                    country={country} 
                    timezoneOffsetFormatted={timezoneOffsetFormatted} 
                    error={error}
                    isCelsius={isCelsius}
                    setIsCelsius={setIsCelsius}
                />
            )}
            <Forecast forecastData={forecastData} isCelsius={isCelsius} />
            {weather && (
                <Highlights highlights={highlights} />
            )}
        </div>
    );
}