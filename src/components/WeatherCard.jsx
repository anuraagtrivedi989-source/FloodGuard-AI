import {
    calculateRiskScore,
    getRiskLevel,
} from "../utils/riskCalculator";

const WeatherCard = ({ weather }) => {
    const riskScore = calculateRiskScore(weather);

    const riskLevel = getRiskLevel(riskScore);
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
                    <p className="text-lg font-semibold whitespace-nowrap">
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
                    <p className="text-lg font-semibold whitespace-nowrap">
                        💨 {weather.windSpeed} km/h
                    </p>
                </div>

                <div className="col-span-2 mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        Flood Risk Score
                    </p>
                    <p className="text-2xl font-bold">
                        {riskScore}/100
                    </p>
                    <p
                        className={`font-semibold ${riskLevel === "Critical"
                            ? "text-red-600"
                            : riskLevel === "High"
                                ? "text-orange-500"
                                : riskLevel === "Medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                            }`}
                    >
                        Risk Level: {riskLevel}
                    </p>

                </div>

            </div>
        </div>
    );
};

export default WeatherCard;