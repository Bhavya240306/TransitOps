export default function ActiveTripCard(){

return(

<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

<div className="flex justify-between">

<h2 className="font-bold text-xl">

Active Trip

</h2>

<span className="bg-green-500 text-white px-4 py-1 rounded">

Live

</span>

</div>

<div
className="mt-5
rounded-xl
bg-slate-200
dark:bg-slate-700
h-[350px]
flex
justify-center
items-center
text-gray-500">

Google Maps

</div>

<div className="grid grid-cols-3 mt-6 gap-6">

<div>

<p className="text-gray-500">

Driver

</p>

<b>Alex Johnson</b>

</div>

<div>

<p className="text-gray-500">

Vehicle

</p>

<b>Van-05</b>

</div>

<div>

<p className="text-gray-500">

ETA

</p>

<b>2 hr 14 min</b>

</div>

</div>

</div>

)

}