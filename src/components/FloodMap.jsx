import { useEffect, useState } from "react";
import { getFloodLocations, getShelters, } from "../services/api";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// import floodLocations from "../data/floodLocations";




delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const riskIcons = {
  Critical: new L.Icon({
    iconUrl:
      "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  }),

  High: new L.Icon({
    iconUrl:
      "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    iconSize: [32, 32],
  }),

  Medium: new L.Icon({
    iconUrl:
      "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32],
  }),

  Low: new L.Icon({
    iconUrl:
      "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  }),
};

const shelterIcon = new L.Icon({
  iconUrl:
    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const recommendedShelterIcon = L.divIcon({
  className: "recommended-shelter-marker",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      background: purple;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: bold;
    ">
      ★
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const FloodMap = ({ recommendedShelter }) => {
  const [floodLocations, setFloodLocations] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFloodLocations = async () => {
      try {
        const data = await getFloodLocations();
        setFloodLocations(data);

        const shelterData = await getShelters();

        setShelters(shelterData);
      } catch (err) {
        setError("Unable to load flood locations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFloodLocations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          🌊 Live Flood Risk Map
        </h2>

        <p>Loading flood locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          🌊 Live Flood Risk Map
        </h2>

        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-4">
        🌊 Live Flood Risk Map
      </h2>

      <div className="relative">

        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          style={{
            height: "500px",
            width: "100%",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {floodLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={riskIcons[location.risk]}
            >
              <Popup>

                <div className="w-52">

                  <h3 className="text-lg font-bold mb-2">
                    📍 {location.city}
                  </h3>

                  <p>
                    🌧️ Rainfall: {location.rainfall} mm
                  </p>

                  <p>
                    🌊 Water Level: {location.waterLevel} m
                  </p>

                  <p>
                    👥 Population at Risk:{" "}
                    {location.population}
                  </p>

                  <p className="font-bold mt-2">
                    ⚠️ Risk: {location.risk}
                  </p>

                </div>

              </Popup>
            </Marker>
          ))}

          {shelters.map((shelter) => (
            <Marker
              key={`shelter-${shelter.id}`}
              position={[
                shelter.latitude,
                shelter.longitude,
              ]}
              icon={shelterIcon}
            >
              <Popup>
                <div className="w-52">

                  <h3 className="text-lg font-bold mb-2">
                    🏠 {shelter.name}
                  </h3>

                  <p>
                    📍 {shelter.city}
                  </p>

                  <p>
                    👥 Capacity: {shelter.capacity}
                  </p>

                  <p>
                    🧑‍🤝‍🧑 Occupied: {shelter.occupied}
                  </p>

                  <p>
                    🟢 Available:{" "}
                    {shelter.capacity - shelter.occupied}
                  </p>

                  <p className="font-bold mt-2">
                    Status: {shelter.status}
                  </p>

                </div>
              </Popup>
            </Marker>
          ))}

          {recommendedShelter && (
            <Marker
              position={[
                Number(recommendedShelter.latitude),
                Number(recommendedShelter.longitude),
              ]}
              icon={recommendedShelterIcon}
            >
              <Popup>
                <div className="w-56">
                  <h3 className="text-lg font-bold mb-2">
                    🚨 Recommended Shelter
                  </h3>

                  <p className="font-semibold">
                    🏠 {recommendedShelter.name}
                  </p>

                  <p>
                    📍 {recommendedShelter.city}
                  </p>

                  <p>
                    📏 Distance:{" "}
                    {recommendedShelter.distance_km} km
                  </p>

                  <p>
                    👥 Available:{" "}
                    {recommendedShelter.available_capacity}
                  </p>

                  <p>
                    🟢 Status:{" "}
                    {recommendedShelter.status}
                  </p>

                  <p className="font-bold mt-2">
                    ⚠️ Risk:{" "}
                    {recommendedShelter.risk_level}
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${recommendedShelter.latitude},${recommendedShelter.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold"
                  >
                    🧭 Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          )}

        </MapContainer>

        {/* Risk Legend */}

        <div className="absolute bottom-5 right-5 bg-white p-4 rounded-xl shadow-lg z-50">

          <h3 className="font-bold mb-2">
            Flood Risk
          </h3>

          <div className="space-y-1">

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500"></span>
              <span>Critical</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
              <span>Medium</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
              <span>Low</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


export default FloodMap;