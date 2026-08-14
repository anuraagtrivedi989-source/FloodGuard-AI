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

export const predictFloodRisk = async ({
  rainfall,
  water_level,
  humidity,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rainfall,
        water_level,
        humidity,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to predict flood risk");
  }

  return response.json();
};

export const getAvailableShelters = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/shelters/available`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch available shelters");
  }

  return response.json();
};