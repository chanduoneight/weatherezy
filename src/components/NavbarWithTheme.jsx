import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Box, IconButton, useTheme, ThemeProvider, createTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import "./Navbar.css";
import logo from "../components/logo.png";

const Navbar = ({ toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  // Toggle the mobile menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar" style={{ background: theme.palette.background.default, color: theme.palette.text.primary }}>
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Weather Logo" className="logo-img" />
          <h2 className="logo-text">Weatherezy</h2>
        </Link>
      </div>
      <IconButton onClick={toggleTheme} color="inherit">
        {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/forecast" onClick={() => setIsOpen(false)}>Forecast</Link></li>
        <li><Link to="/map" onClick={() => setIsOpen(false)}>Map</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default function NavbarWithTheme() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Navbar toggleTheme={() => setMode((prev) => (prev === "light" ? "dark" : "light"))} />
    </ThemeProvider>
  );
}
