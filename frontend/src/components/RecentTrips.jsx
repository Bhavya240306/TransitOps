const trips=[

{
id:1,
driver:"Alex",
vehicle:"Van-05",
status:"On Trip"
},

{
id:2,
driver:"John",
vehicle:"Truck-02",
status:"Completed"
},

{
id:3,
driver:"Emily",
vehicle:"Mini Van",
status:"Pending"
}

];

export default function RecentTrips(){

return(

<div className="bg-white rounded-xl shadow p-6">

<h2 className="font-bold text-lg mb-5">

Recent Trips

</h2>

<table className="w-full">

<thead>

<tr className="text-left border-b">

<th>ID</th>

<th>Driver</th>

<th>Vehicle</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{trips.map((trip)=>(

<tr
key={trip.id}
className="border-b h-12"
>

<td>{trip.id}</td>

<td>{trip.driver}</td>

<td>{trip.vehicle}</td>

<td>

<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">

{trip.status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}