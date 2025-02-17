const getStatusUV = (value) => {
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
export { getStatusUV };