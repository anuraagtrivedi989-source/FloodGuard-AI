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

export const recommendShelter = async (city) => {
  const response = await fetch(
    `${API_BASE_URL}/api/shelters/recommend?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error("No available shelter found");
  }

  const data = await response.json();

  return data.recommended_shelter;
};

export const submitFloodReport = async (reportData) => {
  const formData = new FormData();

  formData.append(
    "description",
    reportData.description || ""
  );

  formData.append(
    "latitude",
    reportData.latitude
  );

  formData.append(
    "longitude",
    reportData.longitude
  );

  if (reportData.photo) {
    formData.append("photo", reportData.photo);
  }

  const response = await fetch(
    "http://127.0.0.1:5000/api/flood-reports",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit flood report");
  }

  return response.json();
};