import { useEffect, useState } from "react";

import Header from "../components/Header";

import StatCard from "../components/StatCard";

import FloodMap from "../components/FloodMap";

import RiskSummary from "../components/RiskSummary";

import WeatherCard from "../components/WeatherCard";

import weatherData from "../data/weatherData";

import ShelterCard from "../components/ShelterCard";

import { getShelters } from "../services/api";

const Dashboard = () => {
const [shelters, setShelters] = useState([]);
const [sheltersLoading, setSheltersLoading] = useState(true);
const [sheltersError, setSheltersError] = useState("");

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
        title = "🌧️ Rainfall"
        value = "180 mm"
        color="bg-purple-500"
        />
      </div>
      <RiskSummary/>
      
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
      <FloodMap />
    </div>
  );
};

export default Dashboard;