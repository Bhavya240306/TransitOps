import { useState } from "react";
import api from "../api/axios";

export default function TripForm({setRecommendation}){

const [trip,setTrip]=useState({

source:"",
destination:"",
cargoWeight:""

});

async function recommend(){

const res=await api.post("/trips/recommend",trip);

setRecommendation(res.data);

}

return(

<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8">

<h2 className="font-bold text-2xl mb-6">

Plan New Trip

</h2>

<div className="space-y-5">

<input

placeholder="Source"

className="border rounded-lg p-3 w-full dark:bg-slate-700"

onChange={(e)=>setTrip({...trip,source:e.target.value})}

/>

<input

placeholder="Destination"

className="border rounded-lg p-3 w-full dark:bg-slate-700"

onChange={(e)=>setTrip({...trip,destination:e.target.value})}

/>

<input

type="number"

placeholder="Cargo Weight (kg)"

className="border rounded-lg p-3 w-full dark:bg-slate-700"

onChange={(e)=>setTrip({...trip,cargoWeight:e.target.value})}

/>

<button

onClick={recommend}

className="bg-blue-600 text-white px-6 py-3 rounded-lg"

>

Find Best Assignment

</button>

</div>

</div>

)

}