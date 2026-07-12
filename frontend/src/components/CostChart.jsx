import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const data = [

    {month:"Jan",cost:32000},

    {month:"Feb",cost:41000},

    {month:"Mar",cost:29000},

    {month:"Apr",cost:51000},

    {month:"May",cost:46000},

    {month:"Jun",cost:39000}

];

export default function CostChart(){

return(

<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

<h2 className="font-bold text-xl mb-5">

Monthly Operational Cost

</h2>

<div style={{width:"100%",height:300}}>

<ResponsiveContainer>

<BarChart data={data}>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="cost" fill="#2563eb"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)

}