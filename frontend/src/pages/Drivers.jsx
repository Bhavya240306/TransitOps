import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";

const STATUS_STYLES = {
    PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
    AVAILABLE: "bg-green-100 text-green-700",
    ON_TRIP: "bg-blue-100 text-blue-700",
    SUSPENDED: "bg-red-100 text-red-700",
};

export default function Drivers() {

    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState("");
    const [busyId, setBusyId] = useState(null);

    async function loadDrivers() {

        try {

            const res = await api.get("/drivers");
            setDrivers(res.data.data || []);

        } catch (err) {

            console.log(err);
            toast.error("Couldn't load drivers");

        }

    }

    useEffect(() => {

        loadDrivers();

    }, []);

    async function runAction(id, action) {

        setBusyId(id);

        try {

            await api.patch(`/drivers/${id}/${action}`);
            toast.success(`Driver ${action}d`);
            await loadDrivers();

        } catch (err) {

            const message = err.response?.data?.error?.message || "Action failed";
            toast.error(message);

        } finally {

            setBusyId(null);

        }

    }

    const filtered = drivers.filter((driver) =>
        driver.licenseNumber?.toLowerCase().includes(search.toLowerCase()) ||
        driver.user?.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Driver Registry
                </h1>

            </div>

            <input
                placeholder="Search by name or license..."
                className="border rounded-lg px-4 py-2 w-80 mb-6 dark:bg-slate-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full text-left">

                    <thead className="bg-slate-50 text-sm text-gray-500">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">License No.</th>
                            <th className="p-4">License Expiry</th>
                            <th className="p-4">Safety Score</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((driver) => (
                            <tr key={driver.id} className="border-t">
                                <td className="p-4">{driver.user?.fullName}</td>
                                <td className="p-4">{driver.licenseNumber}</td>
                                <td className="p-4">{driver.licenseExpiryDate}</td>
                                <td className="p-4">{driver.safetyScore}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[driver.status] || "bg-gray-100 text-gray-600"}`}>
                                        {driver.status}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">

                                    {driver.status === "PENDING_APPROVAL" && (
                                        <button
                                            disabled={busyId === driver.id}
                                            onClick={() => runAction(driver.id, "approve")}
                                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm disabled:opacity-60"
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {driver.status !== "SUSPENDED" && driver.status !== "PENDING_APPROVAL" && (
                                        <button
                                            disabled={busyId === driver.id}
                                            onClick={() => runAction(driver.id, "suspend")}
                                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm disabled:opacity-60"
                                        >
                                            Suspend
                                        </button>
                                    )}

                                    {driver.status === "SUSPENDED" && (
                                        <button
                                            disabled={busyId === driver.id}
                                            onClick={() => runAction(driver.id, "reinstate")}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm disabled:opacity-60"
                                        >
                                            Reinstate
                                        </button>
                                    )}

                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-400">
                                    No drivers found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

            </div>

        </div>

    );

}
