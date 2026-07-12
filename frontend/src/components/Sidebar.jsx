import { useContext } from "react";
import {
    LayoutDashboard,
    Truck,
    Users,
    Route,
    Wrench,
    BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const menus = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
    { title: "Vehicles", icon: Truck, path: "/vehicles", roles: ["FLEET_MANAGER"] },
    { title: "Drivers", icon: Users, path: "/drivers", roles: ["FLEET_MANAGER", "SAFETY_OFFICER"] },
    { title: "Trips", icon: Route, path: "/trips", roles: ["FLEET_MANAGER"] },
    { title: "Maintenance", icon: Wrench, path: "/maintenance", roles: ["FLEET_MANAGER"] },
    { title: "Reports", icon: BarChart3, path: "/reports", roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"] },
];

export default function Sidebar() {
    const { user } = useContext(AuthContext);
    const visibleMenus = menus.filter((item) => item.roles.includes(user?.role));

    return (
        <aside className="w-64 h-screen bg-slate-900 text-white fixed">
            <div className="text-2xl font-bold p-6 border-b border-slate-700">
                TransitOps
            </div>
            <div className="mt-4 flex flex-col">
                {visibleMenus.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 hover:bg-slate-800 ${isActive ? "bg-blue-600" : ""}`
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