import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherComponent from "./components/WeatherCard";
import SearchComponent from "./components/Search";
import FiveDayForecast from "./components/FiveDayForecast";
import HourForecast from "./components/HourForecast";
import MapComponent from "./components/MapComponent";
import Contact from "./components/Contact";
import axios from "axios";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import AboutModal from "./components/AboutModal";
import Snowfall from "./components/Snowfall";

const ErrorMessage = ({ message }) => (
  <div className="error-message" style={{ color: "red", padding: "1rem" }}>
    {message}
  </div>
);
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [population, setPopulation] = useState(null);
  const [units, setUnits] = useState("metric"); // Toggle between metric and imperial
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Fetch API key
  console.log("API Key from environment:", apiKey);

  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);

  const fetchWeatherByCoords = useCallback(
    async (lat, lon, isCurrent = false) => {
      setLoading(true);
      setError(null);
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
        const response = await axios.get(weatherUrl);
        if (response.status === 200 && response.data && response.data.city) {
          const data = response.data;
          setWeatherData(data);
          setIsCurrentLocation(isCurrent);
          setCurrentCity(data.city.name);
          setCurrentCountry(data.city.country);
          setPopulation(data.city.population);
        } else {
          setError("Invalid weather data received from the API.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
        setError("Unable to retrieve weather data.");
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, units]
  );
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
              true
            );
          },
          (error) => {
            const errorMessage =
              error.code === 1
                ? "Permission denied. Please allow location access."
                : error.code === 2
                  ? "Position unavailable. Please try again."
                  : "Timeout. Unable to retrieve location.";
            console.error("Geolocation error:", errorMessage);
            setError(errorMessage);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
    getCurrentLocation();
  }, [fetchWeatherByCoords]);
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    try {
      const geoResponse = await axios.get(geocodeUrl);
      const geoData = geoResponse.data;
      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        await fetchWeatherByCoords(lat, lon);
      } else {
        setError("City not found. Please try another search.");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error.message);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Define the toggleUnits function
  const toggleUnits = () => {
    setUnits((prevUnits) => (prevUnits === "metric" ? "imperial" : "metric"));
  };
  const hourlyForecastData = weatherData
    ? weatherData.list.map((item) => ({
      time: item.dt * 1000,
      temperature: item.main.temp,
      condition: item.weather[0].description.toLowerCase(),
    }))
    : [];
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="main">
        <Snowfall />
        <Navbar onAboutClick={toggleAbout} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchComponent onSearch={fetchWeather} />
                {loading ? (
                  <Loader />
                ) : error ? (
                  <ErrorMessage message={error} />
                ) : (
                  <>
                    {isCurrentLocation && (
                      <div className="current-location">
                        <h2 style={{ color: "var(--text-main)" }}>Weather at your current location: {currentCity},{" "}
                          {currentCountry}</h2>
                      </div>
                    )}
                    {weatherData && (
                      <>
                        <WeatherComponent
                          weather={weatherData.list[0]}
                          city={currentCity}
                          country={currentCountry}
                          units={units}
                          toggleUnits={toggleUnits} // Pass the function as a prop
                        />


                      </>
                    )}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/forecast"
            element={
              weatherData && (
                <>
                  <h1 style={{ color: "var(--text-main)" }}>Forecast for {currentCity}</h1>
                  <HourForecast forecastData={hourlyForecastData} />
                  <FiveDayForecast
                    forecastList={weatherData.list}
                    cityName={currentCity}
                  />
                </>
              )
            }
          />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div >
      <Footer onAboutClick={toggleAbout} />
      <AboutModal isOpen={isAboutOpen} onClose={toggleAbout} />
    </Router >
  );
}
export default App;
