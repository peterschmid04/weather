import getCloudy from "../images/cloudy.svg";
import getRain from "../images/rain.svg";
import getSnow from "../images/snow.svg";
import getThunderstorm from "../images/thunderstorm.svg";
import getClear from "../images/clear.svg";
import getFog from "../images/fog.svg";
import getClouds from "../images/clouds.svg";

const getWeatherImage = (weatherId) => {
    switch (true) {
        case weatherId >= 200 && weatherId < 300:
            return getThunderstorm; // Gewitter
        case weatherId >= 300 && weatherId < 400:
            return getClouds; // Nieselregen
        case weatherId >= 500 && weatherId < 600:
            return getRain; // Regen
        case weatherId >= 600 && weatherId < 700:
            return getSnow; // Schnee
        case weatherId >= 700 && weatherId < 800:
            return getFog; // Nebel
        case weatherId === 800:
            return getClear; // Klarer Himmel
        case weatherId >= 801 && weatherId < 810:
            return getCloudy; // Bewölkt
        default:
            return getClouds; // Unbekanntes Wetter
    }
};

export default getWeatherImage;