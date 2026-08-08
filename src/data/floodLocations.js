import { MapContainer, TileLayer } from "react-leaflet";

 const floodLocations = [
  {
    id: 1,
    city: "Delhi",
    position: [28.6139, 77.2090],
    risk: "High",
    rainfall: 180,
    waterLevel: 7.5,
    population: 8200,
  },
  {
    id: 2,
    city: "Mumbai",
    position: [19.0760, 72.8777],
    risk: "Medium",
    rainfall: 120,
    waterLevel: 5.8,
    population: 6100,
  },
  {
    id: 3,
    city: "Bengaluru",
    position: [12.9716, 77.5946],
    risk: "Low",
    rainfall: 60,
    waterLevel: 2.3,
    population: 2300,
  },
  {
    id: 4,
    city: "Chennai",
    position: [13.0827, 80.2707],
    risk: "Medium",
    rainfall: 110,
    waterLevel: 4.8,
    population: 4500,
  },
  {
    id: 5,
    city: "Kolkata",
    position: [22.5726, 88.3639],
    risk: "High",
    rainfall: 145,
    waterLevel: 6.1,
    population: 7200,
  },
  {
    id: 6,
    city: "Guwahati",
    position: [26.1445, 91.7362],
    risk: "Critical",
    rainfall: 210,
    waterLevel: 8.1,
    population: 9100,
  },
];

export default floodLocations;
