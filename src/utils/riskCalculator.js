export const calculateRiskScore = ({
  rainfall,
  humidity,
  waterLevel,
}) => {
  const rainfallScore = Math.min(rainfall / 200, 1) * 40;

  const humidityScore = Math.min(humidity / 100, 1) * 20;

  const waterLevelScore = Math.min(waterLevel / 8, 1) * 40;

  const score =
    rainfallScore +
    humidityScore +
    waterLevelScore;

  return Math.round(score);
};

export const getRiskLevel = (score) => {
  if (score >= 75) {
    return "Critical";
  }

  if (score >= 50) {
    return "High";
  }

  if (score >= 25) {
    return "Medium";
  }

  return "Low";
};