import {
    LayoutDashboard,
    Truck,
    Users,
    Route,
    Wrench,
    BarChart3
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        title: "Vehicles",
        icon: Truck,
        path: "/vehicles",
    },
    {
        title: "Drivers",
        icon: Users,
        path: "/drivers",
    },
    {
        title: "Trips",
        icon: Route,
        path: "/trips",
    },
    {
        title: "Maintenance",
        icon: Wrench,
        path: "/maintenance",
    },
    {
        title: "Reports",
        icon: BarChart3,
        path: "/reports",
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-slate-900 text-white fixed">

            <div className="text-2xl font-bold p-6 border-b border-slate-700">
                TransitOps
            </div>

            <div className="mt-4 flex flex-col">

                {menus.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 hover:bg-slate-800 ${
                                    isActive ? "bg-blue-600" : ""
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.title}
                        </NavLink>
                    );
                })}
            </div>

        </aside>
    );
}