import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { Outlet } from "react-router-dom";

export default function DashboardLayout() {

    return (

        <div className="flex">

            <Sidebar />

            <div className="ml-64 flex-1 min-h-screen bg-gray-100">

                <Navbar />

                <div className="p-8">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}