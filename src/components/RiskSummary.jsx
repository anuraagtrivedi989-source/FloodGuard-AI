import floodLocations from "../data/floodLocations";

const RiskSummary = () => {
  const critical = floodLocations.filter(
    (location) => location.risk === "Critical"
  ).length;

  const high = floodLocations.filter(
    (location) => location.risk === "High"
  ).length;

  const medium = floodLocations.filter(
    (location) => location.risk === "Medium"
  ).length;

  const low = floodLocations.filter(
    (location) => location.risk === "Low"
  ).length;

  const populationAtRisk = floodLocations.reduce(
    (total, location) => total + location.population,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">

      <div className="bg-red-100 p-5 rounded-xl">
        <p className="text-sm text-gray-600">Critical Areas</p>
        <h3 className="text-3xl font-bold text-red-700">
          {critical}
        </h3>
      </div>

      <div className="bg-orange-100 p-5 rounded-xl">
        <p className="text-sm text-gray-600">High Risk</p>
        <h3 className="text-3xl font-bold text-orange-700">
          {high}
        </h3>
      </div>

      <div className="bg-yellow-100 p-5 rounded-xl">
        <p className="text-sm text-gray-600">Medium Risk</p>
        <h3 className="text-3xl font-bold text-yellow-700">
          {medium}
        </h3>
      </div>

      <div className="bg-green-100 p-5 rounded-xl">
        <p className="text-sm text-gray-600">Low Risk</p>
        <h3 className="text-3xl font-bold text-green-700">
          {low}
        </h3>
      </div>

      <div className="bg-blue-100 p-5 rounded-xl">
        <p className="text-sm text-gray-600">
          Population at Risk
        </p>
        <h3 className="text-3xl font-bold text-blue-700">
          {populationAtRisk.toLocaleString()}
        </h3>
      </div>

    </div>
  );
};

export default RiskSummary;