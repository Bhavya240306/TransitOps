import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const data = [

    {month:"Jan",value:62},
    {month:"Feb",value:68},
    {month:"Mar",value:72},
    {month:"Apr",value:81},
    {month:"May",value:88},
    {month:"Jun",value:91}

];

export default function FleetChart(){

return(

<div className="bg-white rounded-xl shadow p-6">

<h2 className="font-bold text-lg mb-6">

Fleet Utilization

</h2>

<div style={{width:"100%",height:300}}>

<ResponsiveContainer>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="value"
stroke="#2563eb"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

)

}