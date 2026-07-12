import StatCard from "../components/StatCard";
import FleetChart from "../components/FleetChart";
import RecentTrips from "../components/RecentTrips";

export default function Dashboard(){

return(

<div>

<h1 className="text-3xl font-bold mb-8">

Dashboard

</h1>

<div className="grid grid-cols-4 gap-6">

<StatCard
title="Active Vehicles"
value="14"
color="bg-blue-600"
/>

<StatCard
title="Drivers On Trip"
value="9"
color="bg-green-600"
/>

<StatCard
title="Maintenance"
value="3"
color="bg-yellow-500"
/>

<StatCard
title="Fuel Cost"
value="₹52,400"
color="bg-red-500"
/>

</div>

<div className="grid grid-cols-3 gap-6 mt-8">

<div className="col-span-2">

<FleetChart/>

</div>

<div>

<div className="bg-white rounded-xl shadow p-6">

<h2 className="font-bold mb-4">

Quick Stats

</h2>

<div className="space-y-4">

<p>Fleet Utilization <b>91%</b></p>

<p>Available Drivers <b>15</b></p>

<p>Trips Today <b>23</b></p>

<p>Fuel Efficiency <b>12.7 km/L</b></p>

</div>

</div>

</div>

</div>

<div className="mt-8">

<RecentTrips/>

</div>

</div>

)

}