import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import "./Navbar.css";
import logo from "../components/logo.jpg";
// import ToggleColorMode from "./ToggleColorMode"; // Unused

const Navbar = ({ onAboutClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle the mobile menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu when navigating to a new route
  const closeMenu = () => setIsOpen(false);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="flex">
            <img src={logo} alt="Weather Logo" />
            <h2 className="logo-text">Weatherzy</h2>
          </div>
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? (
          <FaTimes size={30} className="nav-icon" />
        ) : (
          <FaBars size={30} className="nav-icon" />
        )}
      </div>
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu} className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <span className="nav-link" onClick={() => { onAboutClick(); closeMenu(); }}>
            About
          </span>
        </li>
        <li>
          <Link to="/forecast" onClick={closeMenu} className="nav-link">
            Forecast
          </Link>
        </li>
        <li>
          <Link to="/map" onClick={closeMenu} className="nav-link">
            Map
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMenu} className="nav-link">
            Contact
          </Link>
        </li>
      </ul>

      <div className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? (
          <FaSun size={24} color="#fbbf24" title="Switch to Light Mode" />
        ) : (
          <FaMoon size={24} className="nav-icon" title="Switch to Dark Mode" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
