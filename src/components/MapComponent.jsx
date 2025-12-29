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
import { FaSearch, FaWind } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import "./MapComponent.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerLayer = useRef(null);
  const cycloneLayerRef = useRef(null);
  const weatherLayersRef = useRef({});
  const weatherCache = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeLayer, setActiveLayer] = useState("none"); // none, wind, pressure, precipitation
  const [showCyclones, setShowCyclones] = useState(false);

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

  const fetchCyclones = useCallback(async () => {
    if (!cycloneLayerRef.current) return;
    cycloneLayerRef.current.clearLayers();

    try {
      // GDACS RSS/GeoJSON for Tropical Cyclones
      const response = await axios.get("https://www.gdacs.org/gdacsapi/api/events/geteventlist/type/TC");
      const features = response.data.features || [];

      features.forEach(feature => {
        const { geometry, properties } = feature;
        const [lon, lat] = geometry.coordinates;
        const { eventname, episodeid, severitydata, country } = properties;

        const cycloneIcon = L.divIcon({
          html: `<div class="cyclone-icon-wrapper"><svg viewBox="0 0 512 512" width="30" height="30" fill="red" class="cyclone-svg-animation"><path d="M432 256c0 10.9-2.3 21.2-6.4 30.6-5.8 13.5-14.7 25.1-26 34.4-1.9 1.6-4 3-6.1 4.3-13.8 8.4-29.8 13.3-47 13.3-15.5 0-30-4-42.5-11.1-1.3-.7-2.6-1.5-3.8-2.3-12.7-8.2-22.7-19.4-28.9-32.9-4.8-10.4-7.4-21.9-7.4-34.1h71.1c0 8.8 3.5 16.8 9.2 22.7 5.7 5.8 13.6 9.5 22.4 9.5 8.7 0 16.6-3.6 22.3-9.5 5.7-5.9 9.3-13.9 9.3-22.7 0-9.2-3.8-17.6-9.8-23.6-6.1-6-14.5-9.7-23.8-9.7-8.8 0-16.7 3.5-22.4 9.3-5.7 5.7-9.3 13.7-9.3 22.4h-71.1c0-12.2 2.6-23.7 7.4-34.1 6.2-13.5 16.2-24.7 28.9-32.9 1.2-.8 2.5-1.6 3.8-2.3 12.5-7.1 27-11.1 42.5-11.1 17.2 0 33.2 4.9 47 13.3 2.1 1.3 4.2 2.7 6.1 4.3 11.3 9.3 20.2 20.9 26 34.4 4.1 9.4 6.4 19.7 6.4 30.6z"></path></svg></div>`,
          className: "cyclone-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const popupContent = `
          <div class="cyclone-popup">
            <h3 style="color: #ff4757; margin: 0 0 10px 0;">🌀 Live Cyclone Alert</h3>
            <b>Name:</b> ${eventname}<br>
            <b>Country:</b> ${country || 'International Waters'}<br>
            <b>Severity:</b> ${severitydata?.severity || 'Active Monitoring'}<br>
            <b>Episode ID:</b> ${episodeid}<br>
            <p style="font-size: 0.8rem; margin: 10px 0 0 0;">Data provided by GDACS</p>
          </div>
        `;

        L.marker([lat, lon], { icon: cycloneIcon })
          .addTo(cycloneLayerRef.current)
          .bindPopup(popupContent);

        // Add a warning glow circle
        L.circle([lat, lon], {
          radius: 100000, // 100km radius
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.2,
          weight: 1
        }).addTo(cycloneLayerRef.current);
      });
    } catch (error) {
      console.error("Error fetching cyclone data:", error);
    }
  }, []);

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
      cycloneLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Initialize Weather Layers
      weatherLayersRef.current = {
        wind: L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`),
        pressure: L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`),
        precipitation: L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`)
      };

      const fetchAllCitiesWeather = async () => {
        for (const city of cities) {
          await createMarker(city);
        }
      };
      fetchAllCitiesWeather();
      fetchCyclones(); // Initial fetch
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cities, createMarker, apiKey, fetchCyclones]);

  // Effect to handle layer visibility
  useEffect(() => {
    if (!mapRef.current || !weatherLayersRef.current) return;

    Object.values(weatherLayersRef.current).forEach(layer => {
      if (mapRef.current.hasLayer(layer)) {
        mapRef.current.removeLayer(layer);
      }
    });

    if (activeLayer !== "none" && weatherLayersRef.current[activeLayer]) {
      weatherLayersRef.current[activeLayer].addTo(mapRef.current);
    }
  }, [activeLayer]);

  // Handle Cyclone Visibility
  useEffect(() => {
    if (!mapRef.current || !cycloneLayerRef.current) return;
    if (showCyclones) {
      cycloneLayerRef.current.addTo(mapRef.current);
    } else {
      mapRef.current.removeLayer(cycloneLayerRef.current);
    }
  }, [showCyclones]);

  return (
    <div className="map-page-container">
      <div className="map-header">
        <div className="heading-group">
          <h1 className="heading" style={{ color: "var(--text-main)" }}>Weather Monitoring</h1>
          <p className="subheading">Track cyclones, wind pressures, and live storm updates</p>
        </div>

        <div className="map-controls">
          <div className="layer-toggles">
            <button
              className={`control-btn ${activeLayer === 'none' ? 'active' : ''}`}
              onClick={() => setActiveLayer('none')}
            >Standard</button>
            <button
              className={`control-btn ${activeLayer === 'wind' ? 'active' : ''}`}
              onClick={() => setActiveLayer('wind')}
            >Wind</button>
            <button
              className={`control-btn ${activeLayer === 'pressure' ? 'active' : ''}`}
              onClick={() => setActiveLayer('pressure')}
            >Pressure</button>
            <button
              className={`control-btn ${activeLayer === 'precipitation' ? 'active' : ''}`}
              onClick={() => setActiveLayer('precipitation')}
            >Rain</button>
          </div>

          <button
            className={`control-btn cyclone-toggle-btn ${showCyclones ? 'active-cyclone' : ''}`}
            onClick={() => setShowCyclones(!showCyclones)}
          >
            <FaWind className="btn-icon" /> {showCyclones ? 'Hide Cyclones' : 'Live Cyclone Tracker'}
          </button>

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
        {activeLayer !== 'none' && (
          <div className="map-legend">
            <span>{activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)} Overlay Active</span>
          </div>
        )}
        {showCyclones && (
          <div className="cyclone-legend">
            <div className="pulse-red"></div> Live Cyclone Tracking Enabled
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
