import Header from "../components/Header";
import StatCard from "../components/StatCard";
import FloodMap from "../components/FloodMap";

const Dashboard = () => {
  return (
    <div className="flex-1 p-10 bg-gray-100">
      <Header />

      <div className="grid grid-cols-2 gap-8 mt-8">
        <StatCard
          title="Critical Zones"
          value="7"
          color="bg-red-500"
        />

        <StatCard
          title="High Risk"
          value="15"
          color="bg-orange-500"
        />

        <StatCard
          title="People at Risk"
          value="24.5K"
          color="bg-blue-500"
        />

        <StatCard
          title="Rescue Teams"
          value="18"
          color="bg-green-500"
        />

        <StatCard 
        title = "🌧️ Rainfall"
        value = "180 mm"
        color="bg-purple-500"
        />
      </div>

      <FloodMap />
    </div>
  );
};

export default Dashboard;