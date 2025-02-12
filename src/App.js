import { useState, useEffect, useCallback } from "react";
import "./App.css";
import getCloudy from "./images/cloudy.svg";
import getRain from "./images/rain.svg";
import getSnow from "./images/snow.svg";
import getThunderstorm from "./images/thunderstorm.svg";
import getClear from "./images/clear.svg";
import getFog from "./images/fog.svg";
import getClouds from "./images/clouds.svg";
import iconCloudy from "./images/icons/cloudy.svg";
import iconRain from "./images/icons/rain.svg";
import iconSnow from "./images/icons/snow.svg";
import iconThunderstorm from "./images/icons/thunderstorm.svg";
import iconClear from "./images/icons/clear.svg";
import iconFog from "./images/icons/fog.svg";
import iconClouds from "./images/icons/cloudy.svg";
import iconSunrise from "./images/icons/sun/sunrise-svgrepo-com.svg";
import iconSunset from "./images/icons/sun/sunset-svgrepo-com.svg";

export default function WeatherApp() {
    const [city, setCity] = useState("Lossburg");
    const [weather, setWeather] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState("");

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


            setForecastData([
                { day: forecastDays[1], image: getCloudy, minTemp: (forecastData.daily[1].temp.min - 273.15).toFixed(1), maxTemp: (forecastData.daily[1].temp.max - 273.15).toFixed(1) },
                { day: forecastDays[2], image: getRain, minTemp: (forecastData.daily[2].temp.min - 273.15).toFixed(1), maxTemp: (forecastData.daily[2].temp.max - 273.15).toFixed(1) },
                { day: forecastDays[3], image: getSnow, minTemp: (forecastData.daily[3].temp.min - 273.15).toFixed(1), maxTemp: (forecastData.daily[3].temp.max - 273.15).toFixed(1) },
                { day: forecastDays[4], image: getThunderstorm, minTemp: (forecastData.daily[4].temp.min - 273.15).toFixed(1), maxTemp: (forecastData.daily[4].temp.max - 273.15).toFixed(1) },
                { day: forecastDays[5], image: getClear, minTemp: (forecastData.daily[5].temp.min - 273.15).toFixed(1), maxTemp: (forecastData.daily[5].temp.max - 273.15).toFixed(1) },
                { day: forecastDays[6], image: getFog, minTemp: (forecastData.daily[6].temp.min - 273.15).toFixed(1), maxTemp: (forecastData.daily[6].temp.max - 273.15).toFixed(1) },
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
        if (city.trim()) {
            getWeatherData(city);
        } else {
            setError("Please enter a city!");
        }
    };

    const getWeatherImage = (weatherId) => {
        switch (true) {
            case weatherId >= 200 && weatherId < 300:
                return getThunderstorm; // Gewitter
            case weatherId >= 300 && weatherId < 400:
                return getClouds; // Nieselregen
            case weatherId >= 500 && weatherId < 600:
                return getRain; // Regen
            case weatherId >= 600 && weatherId < 700:
                return getSnow; // Schnee
            case weatherId >= 700 && weatherId < 800:
                return getFog; // Nebel
            case weatherId === 800:
                return getClear; // Klarer Himmel
            case weatherId >= 801 && weatherId < 810:
                return getCloudy; // Bewölkt
            default:
                return getClouds; // Unbekanntes Wetter
        }
    };

    const getWeatherIcons = (weatherId) => {
        switch (true) {
            case weatherId >= 200 && weatherId < 300:
                return iconThunderstorm; // Gewitter
            case weatherId >= 300 && weatherId < 400:
                return iconClouds; // Nieselregen
            case weatherId >= 500 && weatherId < 600:
                return iconRain; // Regen
            case weatherId >= 600 && weatherId < 700:
                return iconSnow; // Schnee
            case weatherId >= 700 && weatherId < 800:
                return iconFog; // Nebel
            case weatherId === 800:
                return iconClear; // Klarer Himmel
            case weatherId >= 801 && weatherId < 810:
                return iconCloudy; // Bewölkt
            default:
                return iconClouds; // Unbekanntes Wetter
        }
    };

    const getStatusUV = (value) => {
        switch (true) {
            case (value <= 2):
                return "Low 😶‍🌫️";
            case (value <= 5):
                return "Moderate 😬";
            case (value <= 7):
                return "High 🧴";
            case (value <= 10):
                return "Very High 😎🧴";
            default:
                return "Extreme 🥵‼️";
        }
    };
    const getStatusWind = (value) => {
        switch (true) {
            case (value <= 5):
                return "Low 🍃";
            case (value <= 10):
                return "Moderate 🌬️";
            case (value <= 20):
                return "High 🌬️";
            case (value <= 30):
                return "Very High 🌬️❗️";
            default:
                return "Extreme 🌪️⚠️";
        }
    };
    const getStatusVisibility = (value) => {
        switch (true) {
            case (value <= 1):
                return "Low 🌫️";
            case (value <= 3):
                return "Moderate 🌫️";
            case (value <= 5):
                return "High 👀";
            case (value <= 10):
                return "Very High 👀";
            default:
                return "Extreme 👀";
        }
    };
    const getStatusHumidity = (value) => {
        switch (true) {
            case (value <= 30):
                return "Low 🏜️";
            case (value <= 60):
                return "Moderate 🏞️";
            case (value <= 80):
                return "High 🌧️";
            case (value <= 100):
                return "Very High 🌧️";
            default:
                return "Extreme 🌊";
        }
    };
    const getStatusAirquality = (value) => {
        switch (true) {
            case (value === 1):
                return "Good 🟢";
            case (value === 2):
                return "Fair 🟡";
            case (value === 3):
                return "Moderate 🟠";
            case (value === 4):
                return "Poor 🔴";
            case (value === 5):
                return "Very Poor 🟤";
            default:
                return "Unknown ❓";
        }
    };
    

    return (
        <div className="weather-grid">
            <form className="sidebar" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="cityInput"
                    placeholder="Search for places..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                {weather && (
                    <div>
                        <div>
                            <img className="image" src={weather.image} alt={weather.description} />
                            <div className="temp">{weather.temp}°C</div>
                            <div className="date">
                                <p className="currentDay">{currentDay}</p>
                                <p className="time">{currentTime}</p>
                            </div>
                            <div className="description">
                                <img className="icon" src={weather.icon} alt="()"/>
                                <p>{weather.description} </p>
                            </div>    
                        </div>
                        
                    </div>
                )}
            </form>   
            {error && <p className="errorDisplay">{error}</p>}
            {/* Error schöner machen*/}
            {weather && (
                <div className="forecast-container">
                <div className="forecast">
                    {forecastData.map((item, index) => (
                        <div key={index} className="forecast-box">
                            <p>{item.day}</p>
                            <img src={item.image} alt={item.description}/>
                        </div>
                    ))}
                </div>
            </div>  
            )}



            {/* Forecasts Platzhalter*/}
            {weather && (
                <div className="highlights-container">
                    <h2>Today's Highlights</h2>
                    <div className="highlights">
                        {highlights.map((item, index) => (
                        <div key={index} className="highlight-box">
                            <h3>{item.title}</h3>
                            {item.title === "Sunrise & Sunset" ? (
                            <div className="sunrise-sunset">
                                <p><img src={iconSunrise} alt="Sunrise" />{item.up}</p>
                                <p><img src={iconSunset} alt="Sunset" />{item.down}</p>
                            </div>
                            ) : (
                            <div>
                                <p><strong>{item.value}</strong> {item.unit}</p>
                                <p>  {item.status}</p>
                            </div>
                            )}  
                        </div>
                        ))}
                    </div>
                </div>    
            )}
        </div>
    );
}