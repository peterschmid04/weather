import React from 'react';
import './UVIndex.css';
import { getStatusUV } from '../utils/statusUtils';

const UVIndex = ({ value, status }) => {
    const uvLevel = getStatusUV(value).toLowerCase().split(' ')[0]; // Extrahiere den UV-Level
    console.log(uvLevel);
    
    return (
        <div className={`uv-index ${uvLevel}`}>
            <div className="uv-bar" style={{ width: `${(value / 11) * 100}%` }}></div>
            <div className="uv-value">{value}</div>
            <div className="uv-status">{getStatusUV(value)}</div>
        </div>
    );
};

export default UVIndex;