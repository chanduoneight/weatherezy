import React, { useState } from "react";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiCloud,
  WiDaySunny,
  WiDayRain,
  WiSnow,
  WiBarometer,
  WiDust,
  WiShowers,
  WiSleet,
  WiHail,
  WiFog,
  WiDaySleetStorm,
} from "react-icons/wi";
import "animate.css";
import sun from "./sun.jpg"; // Morning
import ev from "./ev.jpg"; // Evening
import nights from "./nights.mp4"; // Night
import mon from "./mon.jpg"; // Midnight
import "./WeatherCard.css";

function WeatherComponent({ weather, city = "Unknown City", country = "Unknown Country" }) {
  if (!weather || !weather.main || !weather.weather[0]) {
    return <div className="btn btn-danger">No data found</div>;
  }

  // Define state variables
  const [units, setUnits] = useState("metric");
  const [tempCelsius] = useState(weather.main.temp);
  const [feelsLikeCelsius] = useState(weather.main.feels_like);

  // Convert temperatures based on selected unit
  const temperature = units === "metric" ? tempCelsius : (tempCelsius * 9) / 5 + 32;
  const feelsLike = units === "metric" ? feelsLikeCelsius : (feelsLikeCelsius * 9) / 5 + 32;
  const temperatureUnit = units === "imperial" ? "°F" : "°C";

  // Toggle between Celsius and Fahrenheit
  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  // Get weather condition
  const weatherCondition = weather.weather[0].main.toLowerCase();

  // Get current time
  const now = new Date();
  const currentHour = now.getHours();

  // Set background based on weather and time
  let backgroundStyle = {};
  if (weatherCondition.includes("rain") || weatherCondition.includes("shower")) {
    backgroundStyle.background = `url(${nights}) no-repeat center/cover`; // 🌧️ Rainy
  } else if (currentHour >= 6 && currentHour < 17) {
    backgroundStyle.background = `url(${sun}) no-repeat center/cover`; // 🌅 Morning
  } else if (currentHour >= 17 && currentHour < 20) {
    backgroundStyle.background = `url(${ev}) no-repeat center/cover`; // 🌆 Evening
  } else {
    backgroundStyle.background = `url(${mon}) no-repeat center/cover`; // 🌙 Night
  }

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case "clear":
        return <WiDaySunny size={70} className="icon-bounce" />;
      case "clouds":
        return <WiCloud size={70} className="icon-fade" />;
      case "rain":
      case "showers":
        return <WiDayRain size={70} className="icon-bounce" />;
      case "snow":
        return <WiSnow size={70} />;
      case "sleet":
        return <WiSleet size={70} />;
      case "hail":
        return <WiHail size={70} />;
      case "fog":
        return <WiFog size={70} />;
      case "wintry mix":
        return <WiDaySleetStorm size={70} />;
      default:
        return <WiDaySunny size={70} />;
    }
  };

  return (
    <div className="weatherContainer animate__animated animate__fadeIn" style={backgroundStyle}>
      <div className="mainInfo">
        <h2 className="animate__animated animate__zoomIn">
          Weather in {city}, {country}
        </h2>
        <div className="temperatureSection animate__animated animate__fadeInUp">
          <WiThermometer size={100} />
          <div>
            <p className="temperatureValue">
              {temperature.toFixed(1)} {temperatureUnit}
            </p>
            <p className="feels-like">
              Feels Like: {feelsLike.toFixed(1)} {temperatureUnit}
            </p>
            <button className="btn btn-primary my-2" onClick={toggleUnits}>
              Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
            </button>
          </div>
        </div>
        <div className="weatherIcon animate__animated animate__zoomIn">
          {getWeatherIcon(weather.weather[0].main)}
          <p>
            {weather.weather[0].main} - {weather.weather[0].description}
          </p>
        </div>
      </div>
      <div className="weatherDetailsGrid animate__animated animate__fadeInUp">
        <div className="detailItem">
          <WiHumidity size={30} />
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
        <div className="detailItem">
          <WiStrongWind size={30} />
          <p>
            Wind Speed: {weather.wind.speed} {units === "metric" ? "km/h" : "mph"}, {weather.wind.deg}°
          </p>
        </div>
        <div className="detailItem">
          <WiCloud size={30} />
          <p>Cloudiness: {weather.clouds.all}%</p>
        </div>
        <div className="detailItem">
          <WiDust size={30} />
          <p>Visibility: {weather.visibility / 1000} km</p>
        </div>
        <div className="detailItem">
          <WiBarometer size={30} />
          <p>Pressure: {weather.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherComponent;
