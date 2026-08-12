const API_BASE_URL = "http://localhost:5000";

export const getFloodLocations = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/flood-locations`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch flood locations");
  }

  return response.json();
};

export const getShelters = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/shelters`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shelters");
  }

  return response.json();
};

export const getWeather = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/weather`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
};