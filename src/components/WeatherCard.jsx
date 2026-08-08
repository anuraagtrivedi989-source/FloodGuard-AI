const WeatherCard = ({ weather }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h3 className="text-xl font-bold mb-4">
        📍 {weather.city}
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-sm text-gray-500">
            Temperature
          </p>
          <p className="text-lg font-semibold">
            🌡️ {weather.temperature}°C
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Rainfall
          </p>
          <p className="text-lg font-semibold">
            🌧️ {weather.rainfall} mm
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Humidity
          </p>
          <p className="text-lg font-semibold">
            💧 {weather.humidity}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Wind Speed
          </p>
          <p className="text-lg font-semibold">
            💨 {weather.windSpeed} km/h
          </p>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;