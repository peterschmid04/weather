import React from 'react';
import "./Highlights.css";
import iconSunrise from "../images/icons/sun/sunrise-svgrepo-com.svg";
import iconSunset from "../images/icons/sun/sunset-svgrepo-com.svg";
import UVIndex from './UVIndex.js'; // Importiere die UVIndex-Komponente
import BarChart from './barChart.js'; // Beachte: Der Import muss mit einem Großbuchstaben erfolgen

export default function Highlights({ highlights }) {
    return (
        <div className="highlights-container">
            <h2>Today's Highlights</h2>
            <div className="highlights">
                {highlights && highlights.map((item, index) => (
                    <div key={index} className="highlight-box">
                        <h3>{item.title}</h3>

                        {item.title === "Sunrise & Sunset" ? (
                            <div className="sunrise-sunset">
                                <p><img src={iconSunrise} alt="Sunrise" /> {item.up}</p>
                                <p><img src={iconSunset} alt="Sunset" /> {item.down}</p>
                            </div>
                        ) : item.title === "Air Quality" ? (
                            <BarChart value={(((item.value - 1) / 4) * 100)} /> // Hier wird BarChart als Komponente genutzt
                        ) : item.title === "Humidity" ? (
                            <BarChart value={item.value} /> // Hier wird BarChart als Komponente genutzt
                        ) : item.title === "UV Index" ? (
                            <UVIndex value={item.value} /> // UV-Index-Komponente
                        ) : (
                            <div>
                                <p><strong>{item.value}</strong> {item.unit}</p>
                                <p>{item.status}</p>
                            </div>
                        )}
                        
                    </div>
                ))}
            </div>
        </div>
    );
}