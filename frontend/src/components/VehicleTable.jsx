import api from "../api/axios";

export default function VehicleTable({

vehicles,

refresh

}){

async function deleteVehicle(id){

await api.delete(`/vehicles/${id}`);

refresh();

}

return(

<div className="bg-white dark:bg-slate-800 rounded-xl shadow">

<table className="w-full">

<thead>

<tr className="border-b">

<th className="p-4">Registration</th>

<th>Name</th>

<th>Capacity</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{vehicles.map(vehicle=>(

<tr
key={vehicle.id}
className="border-b"
>

<td className="p-4">

{vehicle.registrationNumber}

</td>

<td>

{vehicle.model}

</td>

<td>

{vehicle.capacityKg} kg

</td>

<td>

<span
className={`

px-3 py-1 rounded

${vehicle.status==="Available"
?"bg-green-200 text-green-700"
:"bg-red-200 text-red-700"}

`}
>

{vehicle.status}

</span>

</td>

<td>

<div className="flex gap-3">

<button>

✏️

</button>

<button
onClick={()=>deleteVehicle(vehicle.id)}
>

🗑

</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}