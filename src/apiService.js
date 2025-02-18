const apiKey = "15602a28018e8d952821183312c1099c";

export const getWeatherData = async (city) => {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUVData = async (lat, lon) => {
    try {
        const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(uvUrl);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getAirQualityData = async (lat, lon) => {
    try {
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(airQualityUrl);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getForecastData = async (lat, lon) => {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`;
        const response = await fetch(forecastUrl);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};
