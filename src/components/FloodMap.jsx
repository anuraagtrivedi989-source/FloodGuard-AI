import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import floodLocations from "../data/floodLocations";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
    

const FloodMap = () => {

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        🌊 Live Flood Risk Map
      </h2>

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


{floodLocations.map((location) => (
  <Marker
    key={location.id}
    position={location.position}
  >
    <Popup>
     <h3 className="font-bold text-lg">
          {location.city}
        </h3>

        <p>🌧 Rainfall: {location.rainfall} mm</p>
        <p>🌊 Water Level: {location.waterLevel} m</p>
        <p>⚠ Risk: {location.risk}</p>
        <p>👥 Population: {location.population}</p>
    </Popup>
  </Marker>
))}
       
        
      </MapContainer>
    </div>
  );
};

export default FloodMap;