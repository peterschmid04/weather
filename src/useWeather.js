import { useState, useEffect, useCallback } from "react";

export function useWeather(apiKey, defaultCity) {
    const [weather, setWeather] = useState(null);
    const getWeatherData = useCallback(async (city) => {
        try {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Could not fetch weather data");
            const data = await response.json();
            setWeather({ city: data.name, temp: (data.main.temp - 273.15).toFixed(1) });
        } catch (error) {
            setWeather(null);
        }
    }, [apiKey]);

    useEffect(() => {
        getWeatherData(defaultCity);
    }, [getWeatherData, defaultCity]);

    return { weather, getWeatherData };
}