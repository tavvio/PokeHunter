# PokeHunter
This fullstack app shows Pokémons and their types based on real-time weather data from the city entered by the user.

## Technologies used
- React + TypeScript;
- NodeJS + Express + TypeScript;
- Axios (for HTTP requests);
- Vite (front-end bundler);
- Mocha for unit tests;

## Features
- Users can enter a city name to initiate the search;
- The back-end fetches real-time weather data based on the city using the OpenWeatherMap API;
- Based on the current temperature of the city entered, the front-end defines the type of pokemon that should appear in that location;
- Weather information is displayed, including temperature, rain status, and the assigned Pokémon type;
- Integration with two external APIs: [OpenWeatherMap](https://openweathermap.org/) for weather and [PokéAPI](https://pokeapi.co/) for Pokémon data;
- Five random Pokémon are displayed with their image, name, and types as icons;
- Separation of environments between front-end and back-end for better structure and maintainability;

## How to run
1. Clone the repository;

2. Run the back-end in a separate terminal (the server will run on port 3000):
```bash
cd server
npm install
npm run dev
```

3. Run the front-end in another terminal (Vite will run on port 5173):
```bash
cd client
npm install
npm run dev
```

## Requirements:
- Node.js version 18 or higher;
- npm;

Access the URL http://localhost:5173/ to view.
