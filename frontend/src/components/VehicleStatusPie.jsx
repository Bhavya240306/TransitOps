import {

PieChart,

Pie,

Cell,

Tooltip,

ResponsiveContainer

} from "recharts";

const data=[

{name:"Available",value:12},

{name:"On Trip",value:6},

{name:"Maintenance",value:3}

];

const COLORS=[

"#16a34a",

"#2563eb",

"#eab308"

];

export default function VehicleStatusPie(){

return(

<div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

<h2 className="font-bold text-xl mb-5">

Vehicle Status

</h2>

<div style={{width:"100%",height:300}}>

<ResponsiveContainer>

<PieChart>

<Pie

data={data}

outerRadius={100}

dataKey="value"

label

>

{data.map((entry,index)=>

<Cell

key={index}

fill={COLORS[index]}

/>

)}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

)

}