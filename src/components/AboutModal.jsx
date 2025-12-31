import React from "react";
import { FaTimes, FaCloudSun, FaCalendarAlt, FaSearchLocation } from "react-icons/fa";
import "./AboutModal.css";

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate__animated animate__zoomIn" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="modal-header">
                    <h2 className="modal-title">About Weatherzy</h2>
                </div>
                <div className="modal-body">
                    <p className="about-intro">
                        A weather app provides real-time weather information for specific locations. Users can view temperature, humidity, wind speed, and forecasts for the upcoming days.
                    </p>

                    <div className="about-features">
                        <div className="feature-item">
                            <FaCloudSun className="feature-icon" />
                            <div>
                                <h3>Real-time Data Fetching</h3>
                                <p>Implemented <strong>Current Weather Data API</strong> to retrieve live temperature, wind speed, and atmospheric conditions for any city entered.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <FaCalendarAlt className="feature-icon" />
                            <div>
                                <h3>Forecast Engine</h3>
                                <p>Integrated the <strong>5-Day / 3-Hour Forecast API</strong> to process and display future weather trends and periodic updates.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <FaSearchLocation className="feature-icon" />
                            <div>
                                <h3>Geocoding Implementation</h3>
                                <p>Utilized the <strong>Geocoding API</strong> to enable precise location mapping, converting search strings into mathematical coordinates for accurate data retrieval.</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-footer">
                        <p className="version">Fully powered by OpenWeather API v2.5</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
