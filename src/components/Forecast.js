import "./Forecast.css";
import React from 'react';

const convertTemperature = (temp, isCelsius) => {
    return isCelsius ? temp : (temp * 9/5 + 32).toFixed(1);
};

export default function Forecast({ forecastData, isCelsius }) {
    return (
    <div className="forecast-container">
        <div className="forecast">
            {forecastData.map((item, index) => (
                <div key={index} className="forecast-box">
                    <p>{item.day}</p>
                    <img src={item.image} alt="" />
                    <p>{convertTemperature(item.minTemp, isCelsius)}° / {convertTemperature(item.maxTemp, isCelsius)}° </p>
                </div>
            ))}
        </div>
    </div>
    );
}

