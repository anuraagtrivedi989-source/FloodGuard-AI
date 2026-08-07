const Sidebar = () => {
  return (
    <div className="w-72 min-h-screen bg-blue-900 text-white p-5">
      <h1 className="text-4xl font-bold mb-10">🌊 FloodGuard AI</h1>

      <ul className="space-y-6 text-2xl">
        <li>📊 Dashboard</li>
        <li>🗺️ Flood Map</li>
        <li>📦 Resources</li>
        <li>🏠 Shelters</li>
        <li>🚨 Emergency</li>
      </ul>
    </div>
  );
};

export default Sidebar;