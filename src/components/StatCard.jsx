const StatCard = ({ title, value, color }) => {
  return (
    <div className={`${color} text-white rounded-2xl p-6 shadow`}>
      <h2 className="text-2xl font-bold">{title}</h2>

      <p className="text-5xl font-bold mt-6">
        {value}
      </p>
    </div>
  );
};

export default StatCard;