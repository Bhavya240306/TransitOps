import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { Outlet } from "react-router-dom";

export default function DashboardLayout() {

    return (

        <div className="flex">

            <Sidebar />

            <div className="ml-64 flex-1 min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-950 dark:to-slate-900">

                <Navbar />

                <div className="p-8">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}