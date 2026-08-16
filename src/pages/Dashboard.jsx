import { useEffect, useState } from "react";

import Header from "../components/Header";

import StatCard from "../components/StatCard";

import FloodMap from "../components/FloodMap";

import RiskSummary from "../components/RiskSummary";

import WeatherCard from "../components/WeatherCard";

import weatherData from "../data/weatherData";

import ShelterCard from "../components/ShelterCard";

import { getAvailableShelters, getShelters, getWeather, predictFloodRisk, recommendShelter, submitFloodReport } from "../services/api";

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

  const [recommendedShelter, setRecommendedShelter] = useState(null);
  const [shelterRecommendationLoading, setShelterRecommendationLoading] =
    useState(false);
  const [shelterRecommendationError, setShelterRecommendationError] =
    useState("");

  const [reportDescription, setReportDescription] = useState("");
  const [reportLatitude, setReportLatitude] = useState("");
  const [reportLongitude, setReportLongitude] = useState("");
  const [reportPhoto, setReportPhoto] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

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
  // =====================predictionHandler================== //
  const handlePrediction = async () => {
    setPredictionLoading(true);
    setPredictionError("");
    setShelterRecommendationError("");

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

      // Automatically recommend a shelter for High/Critical risk
      const risk = String(
        result.risk || result.prediction || result.flood_risk || ""
      ).toLowerCase();

      if (risk === "high" || risk === "critical") {
        setShelterRecommendationLoading(true);

        try {
          const shelter = await recommendShelter(selectedCity);
          setRecommendedShelter(shelter);
        } catch (shelterError) {
          console.error(
            "Shelter recommendation failed:",
            shelterError
          );

          setRecommendedShelter(null);
          setShelterRecommendationError(
            "Unable to find a suitable shelter"
          );
        } finally {
          setShelterRecommendationLoading(false);
        }
      } else {
        setRecommendedShelter(null);
        setShelterRecommendationError("");
      }

    } catch (error) {
      console.error(error);
      setPredictionError("Unable to get flood prediction");
    } finally {
      setPredictionLoading(false);
    }
  };

  //  ===============ReportLOcation========== //
  const getReportLocation = () => {
    if (!navigator.geolocation) {
      setReportMessage("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setReportLatitude(position.coords.latitude);
        setReportLongitude(position.coords.longitude);
        setReportMessage("📍 Location captured successfully");
      },
      (error) => {
        console.error(error);
        setReportMessage("Unable to get your location.");
      }
    );
  };

  const handleFloodReport = async () => {
    if (!reportLatitude || !reportLongitude) {
      setReportMessage("Please capture your location first.");
      return;
    }

    setReportLoading(true);
    setReportMessage("");

    try {
      await submitFloodReport({
        description: reportDescription,
        latitude: Number(reportLatitude),
        longitude: Number(reportLongitude),
        photo: reportPhoto,
      });

      setReportMessage("✅ Flood report submitted successfully!");

      setReportDescription("");
      setReportLatitude("");
      setReportLongitude("");
      setReportPhoto(null);
    } catch (error) {
      console.error(error);
      setReportMessage("❌ Failed to submit flood report.");
    } finally {
      setReportLoading(false);
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
      {/* ---Wather Conditions--------- */}
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
        {/* =====Shelters======== */}
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
        {/* =======================Shelter recommendation=========== */}
        {shelterRecommendationLoading && (
          <div className="mt-3 text-blue-600 font-semibold">
            🏠 Finding the most suitable shelter...
          </div>
        )}
        {shelterRecommendationError && (
          <p className="mt-3 text-red-600">
            {shelterRecommendationError}
          </p>
        )}

        {recommendedShelter && (
          <div className="mt-4 p-4 rounded-lg border">
            <h3 className="font-bold text-lg">
              🏠 Recommended Shelter
            </h3>

            <p>{recommendedShelter.name}</p>
            <p>{recommendedShelter.city}</p>

            <p>
              📏 Distance:{" "}
              <strong>
                {recommendedShelter.distance_km} km
              </strong>
            </p>

            <p className="mt-2">
              🕴️ Available spaces:{" "}
              <strong>
                {recommendedShelter.available_capacity}
              </strong>
            </p>

            <p>
              🧱 Status:{" "}
              <strong>{recommendedShelter.status}</strong>
            </p>
            <p>
              🚨 Risk level:{" "}
              <strong>
                {recommendedShelter.risk_level}
              </strong>
            </p>

            <p>
              ⭐ Recommendation score:{" "}
              <strong>
                {recommendedShelter.recommendation_score}
              </strong>
            </p>

            <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
              <h4 className="font-bold text-lg">
                🚨 Emergency Response
              </h4>

              <p className="mt-2">
                Flood Risk:{" "}
                <strong>{recommendedShelter.risk_level}</strong>
              </p>

              <p>
                Shelter Distance:{" "}
                <strong>{recommendedShelter.distance_km} km</strong>
              </p>

              <p>
                Available Capacity:{" "}
                <strong>
                  {recommendedShelter.available_capacity} people
                </strong>
              </p>

              <p>
                Shelter Status:{" "}
                <strong>{recommendedShelter.status}</strong>
              </p>
            </div>
          </div>
        )}

      </div>
      {/* ========Weather Data======== */}
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
      {/* =========AI Flood Prediction============= */}

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
        {predictionLoading && (
          <div className="mt-3 text-blue-600 font-semibold">
            🤖 AI is analyzing flood conditions...
          </div>
        )}

        {predictionError && (
          <p className="mt-4 text-red-600">
            {predictionError}
          </p>
        )}

        {prediction && (
          <div className="mt-4 p-5 rounded-xl border bg-white shadow">
            <h3 className="text-xl font-bold mb-3">
              🤖 AI Flood Prediction
            </h3>

            <p>
              Risk Level:{" "}
              <strong>
                {prediction.risk ||
                  prediction.prediction ||
                  prediction.flood_risk}
              </strong>
            </p>
            {prediction.probability !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">
                    🎯 Prediction Confidence
                  </span>

                  <strong>
                    {(Number(prediction.probability) * 100).toFixed(2)}%
                  </strong>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        Number(prediction.probability) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {prediction && recommendedShelter && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-gray-600">
                🏠 Recommended Shelter
              </p>
              <p className="font-bold text-lg">
                {recommendedShelter.name}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-sm text-gray-600">
                📏 Distance
              </p>
              <p className="font-bold text-lg">
                {recommendedShelter.distance_km} km
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-sm text-gray-600">
                👥 Available Capacity
              </p>
              <p className="font-bold text-lg">
                {recommendedShelter.available_capacity}
              </p>
            </div>

          </div>
        )}

        {prediction &&
          (() => {
            const risk = String(
              prediction.risk ||
              prediction.prediction ||
              prediction.flood_risk ||
              ""
            ).toLowerCase();

            if (risk === "critical") {
              return (
                <div className="mt-4 p-4 rounded-xl border border-red-500 bg-red-50">
                  <h3 className="text-xl font-bold text-red-700">
                    🚨 CRITICAL FLOOD ALERT
                  </h3>

                  <p className="mt-2 text-red-700">
                    Immediate evacuation may be required.
                    Please proceed to the recommended shelter.
                  </p>
                </div>
              );
            }

            if (risk === "high") {
              return (
                <div className="mt-4 p-4 rounded-xl border border-orange-500 bg-orange-50">
                  <h3 className="text-xl font-bold text-orange-700">
                    ⚠️ HIGH FLOOD RISK
                  </h3>

                  <p className="mt-2 text-orange-700">
                    Stay alert and prepare for possible evacuation.
                    A suitable shelter has been recommended below.
                  </p>
                </div>
              );
            }

            return null;
          })()}
      </div>

      <FloodMap recommendedShelter={recommendedShelter} />

      <div className="mt-8 bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          🚨 Report Flooding
        </h2>

        <textarea
          value={reportDescription}
          onChange={(e) => setReportDescription(e.target.value)}
          placeholder="Describe the flooding..."
          className="w-full border rounded-lg p-3 mb-4"
          rows="4"
        />

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            onClick={getReportLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            📍 Use My Location
          </button>

          <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer">
            📷 Choose Photo

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setReportPhoto(e.target.files[0] || null)
              }
            />
          </label>
        </div>

        {reportLatitude && reportLongitude && (
          <p className="text-sm text-green-600 mb-3">
            📍 Location: {reportLatitude}, {reportLongitude}
          </p>
        )}

        {reportPhoto && (
          <p className="text-sm text-gray-600 mb-3">
            📷 Photo: {reportPhoto.name}
          </p>
        )}

        <button
          type="button"
          onClick={handleFloodReport}
          disabled={reportLoading}
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
        >
          {reportLoading
            ? "Submitting..."
            : "🚨 Submit Flood Report"}
        </button>

        {reportMessage && (
          <p className="mt-3 font-semibold">
            {reportMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;