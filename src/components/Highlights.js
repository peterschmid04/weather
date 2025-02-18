import React from 'react';
import "./App.css";
import iconSunrise from "../images/icons/sun/sunrise-svgrepo-com.svg";
import iconSunset from "../images/icons/sun/sunset-svgrepo-com.svg";

export default function Highlights({ highlights }) {
    <div className="highlights-container">
        <h2>Today's Highlights</h2>
        <div className="highlights">
            {highlights && highlights.map((item, index) => (
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
}
