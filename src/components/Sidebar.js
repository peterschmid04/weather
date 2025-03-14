import React from 'react';
import "./Sidebar.css";

const convertTemperature = (temp, isCelsius) => {
    return isCelsius ? temp : ((temp * 9/5) + 32).toFixed(1);
};

export default function Sidebar({ city, setCity, handleSubmit, weather, currentDay, currentTime, isCelsius }) {
    return (
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
                        <div className="temp">{convertTemperature(weather.temp, isCelsius)}°{isCelsius ? 'C' : 'F'}</div>
                        <div className="date">
                            <p className="currentDay">{currentDay}</p>
                            <p className="time">{currentTime}</p>
                        </div>
                        <div className="description">
                            <img className="icon" src={weather.icon} alt="Weather Icon" />
                            <p>{weather.description}</p>
                        </div>    
                    </div>
                </div>
            )}
        </form>
    );
}