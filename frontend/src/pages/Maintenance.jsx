import { useEffect, useState } from "react";

import api from "../api/axios";

export default function Maintenance() {

    const [logs, setLogs] = useState([]);
    const [backendReady, setBackendReady] = useState(true);

    useEffect(() => {

        async function load() {

            try {

                const res = await api.get("/maintenance");
                setLogs(res.data.data || []);

            } catch (err) {

                // The Maintenance backend (models/migration/controller/service)
                // hasn't been built yet — build-order step 5. Fail quietly
                // here instead of showing a scary error screen.
                setBackendReady(false);

            }

        }

        load();

    }, []);

    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Maintenance
                </h1>

            </div>

            {!backendReady && (

                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    Maintenance tracking is coming soon — the backend for this
                    screen hasn't been built yet.
                </div>

            )}

            {backendReady && (

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full text-left">

                        <thead className="bg-slate-50 text-sm text-gray-500">
                            <tr>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Issue</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Opened</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-t">
                                    <td className="p-4">{log.vehicle?.registrationNumber}</td>
                                    <td className="p-4">{log.issue}</td>
                                    <td className="p-4">{log.status}</td>
                                    <td className="p-4">{log.createdAt}</td>
                                </tr>
                            ))}

                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-400">
                                        No maintenance logs yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}
