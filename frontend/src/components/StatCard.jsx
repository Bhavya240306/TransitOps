import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <motion.div
            whileHover={{
                y: -6,
                scale: 1.02
            }}
            className="rounded-2xl
            p-6
            shadow-xl
            bg-white
            dark:bg-slate-900"
        >

            <div className="flex justify-between">

                <div>

                    <p className="text-gray-500">
                        {title}
                    </p>

                    <h1 className="text-4xl font-bold mt-3">

                        <CountUp
                            end={value}
                            duration={2}
                        />

                    </h1>

                </div>

                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
                >

                    {icon}

                </div>

            </div>

        </motion.div>

    );

}