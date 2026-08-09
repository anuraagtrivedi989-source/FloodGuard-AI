const ShelterCard = ({ shelter }) => {
  const available = shelter.capacity - shelter.occupied;

  const occupancyPercentage = Math.round(
    (shelter.occupied / shelter.capacity) * 100
  );

  return (
    <div className="bg-white rounded-xl shadow p-5">

      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-lg font-bold">
            🏠 {shelter.name}
          </h3>

          <p className="text-gray-500">
            📍 {shelter.city}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            shelter.status === "Open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {shelter.status}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Occupancy</span>
          <span>{occupancyPercentage}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${occupancyPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">

        <div>
          <p className="text-sm text-gray-500">
            Capacity
          </p>

          <p className="font-bold">
            {shelter.capacity}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Available
          </p>

          <p className="font-bold">
            {available}
          </p>
        </div>

      </div>

    </div>
  );
};

export default ShelterCard;