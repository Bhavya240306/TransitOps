export default function RecommendationCard({recommendation}){

return(

<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

<h2 className="font-bold text-xl mb-5">

AI Recommendation

</h2>

{recommendation?

<>

<div className="space-y-3">

<p>

Driver

<br/>

<b>{recommendation.driver.name}</b>

</p>

<p>

Vehicle

<br/>

<b>{recommendation.vehicle.model}</b>

</p>

<p>

Safety Score

<br/>

<b>{recommendation.driver.safetyScore}</b>

</p>

<p>

Vehicle Capacity

<br/>

<b>{recommendation.vehicle.maxLoadCapacity} kg</b>

</p>

<button

className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg"

>

Approve Assignment

</button>

</div>

</>

:

<div className="text-gray-500">

No recommendation yet.

</div>

}

</div>

)

}