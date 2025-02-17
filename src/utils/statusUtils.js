export const getStatusUV = (value) => {
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

export const getStatusWind = (value) => {
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

export const getStatusVisibility = (value) => {
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

export const getStatusHumidity = (value) => {
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

export const getStatusAirquality = (value) => {
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