import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import RecentTrips from "../components/RecentTrips";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Active Vehicles" value={stats.activeVehicles} color="bg-blue-600" />
        <StatCard title="Drivers On Trip" value={stats.driversOnTrip} color="bg-green-600" />
        <StatCard title="Maintenance" value={stats.maintenanceVehicles} color="bg-yellow-500" />
        <StatCard title="Fleet Utilization" value={stats.fleetUtilization} color="bg-red-500" />
      </div>
      <div className="mt-8">
        <RecentTrips />
      </div>
    </div>
  );
}
