import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { FaSearch } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import "./MapComponent.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerLayer = useRef(null);
  const weatherCache = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);


  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Memoized Cities
  const cities = useMemo(
    () => [
      { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
      { name: "Delhi", lat: 28.6139, lon: 77.2090 },
      { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
      { name: "Chennai", lat: 13.0827, lon: 80.2707 },
      { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
      { name: "Hyderabad", lat: 17.3850, lon: 78.4867 }
    ],
    []
  );

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case "clear":
        return <WiDaySunny size={20} color="gold" />;
      case "clouds":
        return <WiCloud size={20} color="gray" />;
      case "rain":
        return <WiRain size={20} color="blue" />;
      case "snow":
        return <WiSnow size={20} color="lightblue" />;
      case "thunderstorm":
        return <WiThunderstorm size={20} color="purple" />;
      default:
        return <WiDaySunny size={20} color="gold" />;
    }
  };

  const fetchWeather = useCallback(async (city) => {
    if (weatherCache.current[city.name]) {
      return weatherCache.current[city.name];
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      weatherCache.current[city.name] = response.data;
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      return null;
    }
  }, [apiKey]);

  const createMarker = useCallback(async (city) => {
    if (!markerLayer.current) return;

    const weather = await fetchWeather(city);
    if (weather) {
      const condition = weather.weather[0].main;
      const temp = weather.main.temp;
      const feelsLike = weather.main.feels_like;
      const description = weather.weather[0].description;
      const windSpeed = weather.wind.speed;
      const pressure = weather.main.pressure;

      const iconMarkup = ReactDOMServer.renderToString(getWeatherIcon(condition));
      const markerIcon = L.divIcon({
        html: `<div class="leaflet-weather-icon">${iconMarkup}</div>`,
        className: "custom-icon",
        iconSize: [25, 25],
      });

      const popupContent = `
        <div class="popup-content">
          <b style="color: var(--accent-color)">${city.name}</b><br>
          <b>Temp:</b> ${temp}°C (Feels: ${feelsLike}°C)<br>
          <b>Wind:</b> ${windSpeed} m/s<br>
          <b>Pressure:</b> ${pressure} hPa<br>
          <b>Condition:</b> ${description}
        </div>
      `;

      return L.marker([city.lat, city.lon], { icon: markerIcon })
        .addTo(markerLayer.current)
        .bindPopup(popupContent);
    }
  }, [fetchWeather]);



  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery.trim()}&limit=1&appid=${apiKey}`;

    try {
      const response = await axios.get(geoUrl);
      if (response.data && response.data.length > 0) {
        const { lat, lon, name, country } = response.data[0];
        const newCity = { name: `${name}, ${country}`, lat, lon };

        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 6);
          const marker = await createMarker(newCity);
          if (marker) marker.openPopup();
        }
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location");
    } finally {
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [20.5937, 78.9629],
        zoom: 3,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=FAvGc8Zzbxq4CnFZHwdlPV2KUcs9G9NeBntu49ngNLLLAYAHKavKGerIVeMuG4dX",
        {
          attribution: '&copy; <a href="https://jawg.io" target="_blank">Jawg</a>Maps',
        }
      ).addTo(mapRef.current);

      markerLayer.current = L.layerGroup().addTo(mapRef.current);

      const fetchAllCitiesWeather = async () => {
        for (const city of cities) {
          await createMarker(city);
        }
      };
      fetchAllCitiesWeather();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cities, createMarker, apiKey]);



  return (
    <div className="map-page-container">
      <div className="map-header">
        <div className="heading-group">
          <h1 className="heading" style={{ color: "var(--text-main)" }}>Weather Monitoring</h1>
          <p className="subheading">Interactive Global Weather Map</p>
        </div>

        <div className="map-controls">


          <form className="map-search-form" onSubmit={handleSearch}>
            <div className="map-search-input-wrapper">
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="map-search-input"
              />
              <button type="submit" className="map-search-btn" disabled={isSearching}>
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="map-outer-wrapper">
        <div id="map" className="map"></div>
      </div>
    </div>
  );
};

export default MapComponent;
