import { useEffect, useState } from "react";

import Header from "../components/Header";

import StatCard from "../components/StatCard";

import FloodMap from "../components/FloodMap";

import RiskSummary from "../components/RiskSummary";

import WeatherCard from "../components/WeatherCard";

import weatherData from "../data/weatherData";

import ShelterCard from "../components/ShelterCard";

import { getAvailableShelters, getShelters, getWeather, predictFloodRisk, } from "../services/api";

const Dashboard = () => {

  const [shelters, setShelters] = useState([]);
  const [sheltersLoading, setSheltersLoading] = useState(true);
  const [sheltersError, setSheltersError] = useState("");

  const [weather, setWeather] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  const [selectedCity, setSelectedCity] = useState("Delhi");

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const data = await getShelters();

        setShelters(data);
      } catch (error) {
        console.error(error);
        setSheltersError("Unable to load shelters");
      } finally {
        setSheltersLoading(false);
      }
    };

    fetchShelters();
  }, []);


  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather();

        setWeather(data);
      } catch (error) {
        console.error(error);
        setWeatherError("Unable to load weather data");
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const handlePrediction = async () => {
    setPredictionLoading(true);
    setPredictionError("");

    try {
      const selectedWeather = weather.find(
        (item) => item.city === selectedCity
      );

      if (!selectedWeather) {
        throw new Error("Weather data not found");
      }

      const result = await predictFloodRisk({
        rainfall: Number(selectedWeather.rainfall),
        water_level: Number(selectedWeather.river_level),
        humidity: Number(selectedWeather.humidity),
      });

      setPrediction(result);
    } catch (error) {
      console.error(error);
      setPredictionError("Unable to get flood prediction");
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="flex-1 p-10 bg-gray-100">
      <Header />

      <div className="grid grid-cols-2 gap-8 mt-8">
        <StatCard
          title="Critical Zones"
          value="7"
          color="bg-red-500"
        />

        <StatCard
          title="High Risk"
          value="15"
          color="bg-orange-500"
        />

        <StatCard
          title="People at Risk"
          value="24.5K"
          color="bg-blue-500"
        />

        <StatCard
          title="Rescue Teams"
          value="18"
          color="bg-green-500"
        />

        <StatCard
          title="🌧️ Rainfall"
          value="180 mm"
          color="bg-purple-500"
        />
      </div>
      <RiskSummary />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          🌧️ Weather Conditions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((weather) => (
            <WeatherCard
              key={weather.city}
              weather={weather}
            />
          ))}
        </div>

      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          🏠 Emergency Shelters
        </h2>

        {sheltersLoading && (
          <p>Loading shelters...</p>
        )}

        {sheltersError && (
          <p className="text-red-600">
            {sheltersError}
          </p>
        )}

        {!sheltersLoading && !sheltersError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelters.map((shelter) => (
              <ShelterCard
                key={shelter.id}
                shelter={shelter}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          🌧️ Weather Data
        </h2>

        {weatherLoading && <p>Loading weather...</p>}

        {weatherError && (
          <p className="text-red-600">
            {weatherError}
          </p>
        )}

        {!weatherLoading && !weatherError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weather.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4"
              >
                <h3 className="font-bold text-lg">
                  {item.city}
                </h3>

                <p>🌡️ Temperature: {item.temperature}°C</p>
                <p>💧 Humidity: {item.humidity}%</p>
                <p>🌧️ Rainfall: {item.rainfall} mm</p>
                <p>🌊 River Level: {item.river_level} m</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          🤖 AI Flood Prediction
        </h2>

        <label className="block mb-2 font-semibold">
          Select Location
        </label>

        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setPrediction(null);
          }}
          className="w-full border rounded-lg px-4 py-3 mb-4"
        >
          {weather.map((item) => (
            <option key={item.id} value={item.city}>
              {item.city}
            </option>
          ))}
        </select>

        <button
          onClick={handlePrediction}
          disabled={predictionLoading}
          className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
        >
          {predictionLoading
            ? "Analyzing..."
            : "Predict Flood Risk"}
        </button>

        {predictionError && (
          <p className="mt-4 text-red-600">
            {predictionError}
          </p>
        )}

        {prediction && (
          <div className="mt-5">
            <p className="text-lg">
              Risk: <strong>{prediction.risk}</strong>
            </p>

            <p>
              Probability:{" "}
              <strong>
                {(prediction.probability * 100).toFixed(0)}%
              </strong>
            </p>
          </div>
        )}
      </div>
      
      <FloodMap />
    </div>
  );
};

export default Dashboard;