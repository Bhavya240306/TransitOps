import { TrendingUp } from "lucide-react";

export default function KPICard({
    title,
    value,
    color = "text-blue-600"
}) {

    return (

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

            <div className="flex justify-between">

                <div>

                    <p className="text-gray-500 dark:text-gray-300">
                        {title}
                    </p>

                    <h2 className={`text-3xl font-bold mt-2 ${color}`}>
                        {value}
                    </h2>

                </div>

                <TrendingUp className={color} size={36} />

            </div>

        </div>

    );

}