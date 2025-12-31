import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function SearchComponent({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      alert("Please enter a city name");
      return;
    }
    try {
      await onSearch(inputValue.trim());  // Call the search function passed via props
      setInputValue(""); // Clear the input field after search
      navigate("/"); // Navigate back to home page after search
    } catch (error) {
      console.error("Error during search:", error.message);
    }
  };

  return (
    <div className="search-container">
      <form className="form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <input
            className="search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter city name"
          />
          <button className="search-btn" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchComponent;
