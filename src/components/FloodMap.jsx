import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
     const floodLocations = [
   {
    id: 1,
    city: "Delhi",
    position: [28.6139, 77.209],
    risk: "High",
  },
  {
    id: 2,
    city: "Mumbai",
    position: [19.076, 72.8777],
    risk: "Medium",
  },
  {
    id: 3,
    city: "Bengaluru",
    position: [12.9716, 77.5946],
    risk: "Low",
  },
]; 

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
      {location.city}
      <br />
      Risk: {location.risk}
    </Popup>
  </Marker>
))}
        {/* <Marker position={[28.6139, 77.209]}>
          <Popup>
            🔴 Delhi <br />
            Flood Risk: High
          </Popup>
        </Marker>

        <Marker position={[19.076, 72.8777]}>
          <Popup>
            🟠 Mumbai <br />
            Flood Risk: Medium
          </Popup>
        </Marker>

        <Marker position={[12.9716, 77.5946]}>
          <Popup>
            🟢 Bengaluru <br />
            Flood Risk: Low
          </Popup>
        </Marker> */}

        
      </MapContainer>
    </div>
  );
};

export default FloodMap;