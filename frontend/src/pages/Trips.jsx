import { useState } from "react";
import TripForm from "../components/TripForm";
import RecommendationCard from "../components/RecommendationCard";
import ActiveTripCard from "../components/ActiveTripCard";

export default function Trips(){

const [recommendation,setRecommendation]=useState(null);

return(

<div>

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">

Trip Management

</h1>

</div>

<div className="grid lg:grid-cols-3 gap-6">

<div className="lg:col-span-2">

<TripForm
setRecommendation={setRecommendation}
/>

</div>

<div>

<RecommendationCard
recommendation={recommendation}
/>

</div>

</div>

<div className="mt-8">

<ActiveTripCard/>

</div>

</div>

)

}