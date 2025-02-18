import { useState, useEffect, useCallback } from "react";
import "./App.css";

import Forecast from "./components/Forecast";
import Highlights from "./components/Highlights";   
import Sidebar from "components/Sidebar";

import { getWeatherImage, getWeatherIcons } from "./utils/weatherUtils";
import { getStatusUV, getStatusWind, getStatusVisibility, getStatusHumidity, getStatusAirquality } from "./utils/statusUtils";

import getCloudy from "./images/cloudy.svg";
import getRain from "./images/rain.svg";
import getSnow from "./images/snow.svg";
import getThunderstorm from "./images/thunderstorm.svg";
import getClear from "./images/clear.svg";
import getFog from "./images/fog.svg";


export default function WeatherApp() {
    const [inputCity, setInputCity] = useState("Lossburg");
    const [city, setCity] = useState("Lossburg");
    const [weather, setWeather] = useState(null);
    const [country, setCountry] = useState("");
    const [highlights, setHighlights] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState("");
    const [timezoneOffset, setTimezoneOffset] = useState(0);
    const [isCelsius, setIsCelsius] = useState(true);

    const timezoneOffsetFormatted = timezoneOffset >= 0 ? `+${timezoneOffset}` : timezoneOffset;

    const convertTemperature = (temp) => {
        return isCelsius ? temp : (temp * 9/5 + 32).toFixed(1);
    };

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

    const apiKey = "15602a28018e8d952821183312c1099c"; 

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

            setWeather({
                city: data.name,
                temp: (data.main.temp - 273.15).toFixed(1),
                humidity: data.main.humidity,
                visibility: data.visibility,
                description: data.weather[0].description,
                image: getWeatherImage(data.weather[0].id),
                icon: getWeatherIcons(data.weather[0].id),
            });

            setCity(data.name); // Setze den Stadtwert auf den tatsächlich gefundenen Wert

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

            // setForecastData(forecastData.daily.slice(1, 8).map((day, index) => ({
            //     day: forecastDays[index],
            //     image: getWeatherImage(day.weather[0].id),
            //     description: day.weather[0].description,
            //     tempMin: (day.temp.min - 273.15).toFixed(1),
            //     tempMax: (day.temp.max - 273.15).toFixed(1)
            // })));

            setForecastData([
                { day: forecastDays[1], image: getCloudy, minTemp: "12", maxTemp: "22"},
                { day: forecastDays[2], image: getRain,  minTemp: "", maxTemp: ""},
                { day: forecastDays[3], image: getSnow,  minTemp: "", maxTemp: "" },
                { day: forecastDays[4], image: getThunderstorm, minTemp: "", maxTemp: "" },
                { day: forecastDays[5], image: getClear,  minTemp: "", maxTemp: "" },
                { day: forecastDays[6], image: getFog,  minTemp: "", maxTemp: "" },
            ]);

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
        if (inputCity.trim()) {
            getWeatherData(inputCity);
        } else {
            setError("Please enter a city!");
        }
    };

    const getCountryFlagEmoji = (countryCode) => {
        return countryCode
            .toUpperCase()
            .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
    };

    const cityExists = weather && !error;

    return (
        <div className="weather-grid">
            <Sidebar
                city={inputCity} 
                setCity={setInputCity} 
                handleSubmit={handleSubmit} 
                weather={weather} 
                currentDay={currentDay} 
                currentTime={currentTime} 
                isCelsius={isCelsius} 
            />   
            
            {cityExists &&  weather && (
                <div className="header">{city}, {getCountryFlagEmoji(country)} UTC{timezoneOffsetFormatted}</div>
            )}
            {error && <p className="errorDisplay">{error}</p>}

            {weather && (
                <div className="toggle-buttons">
                    <button onClick={() => setIsCelsius(true)} className={isCelsius ? 'active' : ''}>°C</button>
                    <button onClick={() => setIsCelsius(false)} className={!isCelsius ? 'active' : ''}>°F</button>
                </div>
            )}

            {weather && (
                <Forecast forecastData={forecastData} isCelsius={isCelsius} /> // Verwende die Forecast-Komponente
            )}

            {weather && (
                <Highlights highlights={highlights} /> // Verwende die Highlights-Komponente
            )}
        </div>
    );
}