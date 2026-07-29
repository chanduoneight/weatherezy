# 🌦️ Weatherezy

A modern, responsive weather web app with interactive map search and consolidated current + forecast information for any location. Built with React, Leaflet for maps, and OpenWeather for weather data — focused on simplicity, performance, and a polished UI.

Live demo: https://weatherezyo.netlify.app/

---

## Features

- Search weather by city, state, or country
- Interactive map-based location selection (Leaflet)
- Current weather: temperature, humidity, pressure, wind speed, description & icon
- 5-day forecast (3-hour intervals)
- Responsive UI for desktop, tablet, and mobile
- Light / dark theme toggle
- Smooth animations & loading states

---

## Tech Stack

- Language(s): JavaScript, CSS, HTML
- Framework / build: React (Vite)
- Notable libraries:
  - React 18
  - Leaflet (map interactions)
  - Axios (HTTP requests)
  - MUI (UI components / theming)
  - react-router-dom

APIs:
- OpenWeather API (weather and forecast)
- Google Maps API (if map/search enhancements are used)

---

## Quickstart (development)

1. Clone the repo:
   git clone https://github.com/chanduoneight/weatherezy.git

2. Enter the project directory:
   cd weatherezy

3. Install dependencies:
   npm install

4. Create a .env in the project root with your OpenWeather API key:
   REACT_APP_OPENWEATHER_API_KEY=YOUR_API_KEY

5. Start the dev server:
   npm run dev

Open http://localhost:5173 (Vite default) — if your environment uses a different port, follow Vite output.

---

## Build & Deploy

- Create a production build:
  npm run build

- Preview production build locally:
  npm run preview

- GitHub Pages deploy (configured in package.json):
  npm run deploy

- Netlify: A netlify.toml exists in the repo; connect the repo to Netlify or use Netlify CLI to deploy.

Notes:
- The repository's package.json uses Vite, so local dev command is `npm run dev` (not `npm start`).
- The repo also includes a `homepage` and `gh-pages` deploy script.

---

## Environment variables

Create a `.env` (do not commit it) and add:

REACT_APP_OPENWEATHER_API_KEY=YOUR_API_KEY

(If you integrate additional map APIs, add the relevant keys and keep them secret.)

---

## Project structure

```text
weatherezy/
├── public/               Static files (favicon, vite.svg)
├── src/
│   ├── components/       React components (Navbar, MapComponent, WeatherCard, Forecast, etc.)
│   ├── assets/           Images & other media used by the UI
│   ├── App.jsx           Main application UI and routing
│   ├── main.jsx          React entry point
│   ├── index.css         Global styles
│   └── App.css           App-specific styles
├── package.json
├── vite.config.js
├── netlify.toml
└── README.md
```

How it fits together:
- main.jsx mounts the React app and renders App.jsx.
- App.jsx composes the UI: Navbar, Search, MapComponent, WeatherCard, Forecast components.
- MapComponent uses Leaflet to let users pick a location and triggers weather requests.
- Weather data is fetched (Axios) from OpenWeather and passed into WeatherCard, HourForecast, and FiveDayForecast components.

---

## Screenshots

Add screenshots to the `screenshots/` folder or in the repo and link them here:

screenshots/
├── home.png
├── forecast.png
└── map-search.png

---

## Contributing

Contributions are welcome — thanks!

1. Fork the repo
2. Create a feature branch:
   git checkout -b feature/your-feature
3. Make changes and commit:
   git commit -m "Add feature: description"
4. Push and open a Pull Request:
   git push origin feature/your-feature

Please follow the existing code style and add component-level tests or screenshots for UI changes where possible.

---

## Troubleshooting

- If the map tiles don't load, check the console for Leaflet errors and verify any required map API keys.
- For CORS or API errors from OpenWeather, make sure your key is valid and usage limits haven't been exceeded.
- If you see a blank page in production, confirm the build outputs are deployed and the `homepage`/base path is correct for GitHub Pages or Netlify.

---

## License

This project is licensed under the MIT License.

---

## Author

VAKA CHANDU  
Email: vakachandu99@gmail.com  
GitHub: https://github.com/chanduoneight

---

If you found this project useful, please leave a star on GitHub ⭐
