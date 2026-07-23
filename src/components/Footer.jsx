import React from "react";
import "./Footer.css";
const Footer = ({ onAboutClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bottom mt-4 pt-4 text-center">
        <p className="footer-text" >
          &copy; {2025} FSAD TEAM-9-S-33. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
