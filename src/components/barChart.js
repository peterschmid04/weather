import "./barChart.css";
import React from 'react';


const BarChart = ({ value, status }) => {
    const level = value;
    console.log(level)

    // const airQuality = (value / 5)
    // const level = levelHumidity oder airQuality
    return (
        <div className="w3-light-grey">
            <div
                className="w3-blue"
                style={{ width: `${level}%` }} // React: style als Objekt + Template-Literal für % Angabe
            ></div>
        </div>
    );
}

export default BarChart;