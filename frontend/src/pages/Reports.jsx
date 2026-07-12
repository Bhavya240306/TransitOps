import KPICard from "../components/KPICard";
import CostChart from "../components/CostChart";
import VehicleStatusPie from "../components/VehicleStatusPie";
import ExportButton from "../components/ExportButton";

export default function Reports(){

return(

<div>

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">

Reports & Analytics

</h1>

<ExportButton/>

</div>

<div className="grid grid-cols-4 gap-6">

<KPICard

title="Fleet Utilization"

value="91%"

color="text-green-600"

/>

<KPICard

title="Fuel Efficiency"

value="12.7 km/L"

color="text-blue-600"

/>

<KPICard

title="Operational Cost"

value="₹3.42L"

color="text-red-600"

/>

<KPICard

title="ROI"

value="21.5%"

color="text-yellow-500"

/>

</div>

<div className="grid lg:grid-cols-2 gap-6 mt-8">

<CostChart/>

<VehicleStatusPie/>

</div>

<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 mt-8">

<h2 className="font-bold text-xl mb-5">

Fleet Insights

</h2>

<div className="space-y-4">

<div className="flex justify-between border-b pb-2">

<span>Best Performing Vehicle</span>

<b>Van-05</b>

</div>

<div className="flex justify-between border-b pb-2">

<span>Highest Fuel Consumption</span>

<b>Truck-02</b>

</div>

<div className="flex justify-between border-b pb-2">

<span>Total Trips This Month</span>

<b>84</b>

</div>

<div className="flex justify-between border-b pb-2">

<span>Total Maintenance Cost</span>

<b>₹28,600</b>

</div>

<div className="flex justify-between">

<span>Average Trip Distance</span>

<b>178 km</b>

</div>

</div>

</div>

</div>

)

}