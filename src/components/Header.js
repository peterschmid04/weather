import React from 'react';

export default function Header({ foundCity, country, timezoneOffsetFormatted, error, isCelsius, setIsCelsius }) {
    const getCountryFlagEmoji = (countryCode) => {
        return countryCode
            .toUpperCase()
            .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
    };

    return (
        <div className="header-container">
            {foundCity && (
                <div className="header">
                    {foundCity}, {getCountryFlagEmoji(country)} UTC{timezoneOffsetFormatted}
                </div>
            )}
            {error && <p className="header">{error}</p>}
            <div className="toggle-buttons">
                <button onClick={() => setIsCelsius(true)} className={isCelsius ? 'active' : ''}>°C</button>
                <button onClick={() => setIsCelsius(false)} className={!isCelsius ? 'active' : ''}>°F</button>
            </div>
        </div>
    );
};
