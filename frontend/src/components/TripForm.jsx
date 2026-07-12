import { useState } from "react";
import api from "../api/axios";

export default function TripForm({ setRecommendation, setTripId }) {
  const [trip, setTrip] = useState({
    sourceAddress: "",
    destinationAddress: "",
    cargoWeightKg: "",
  });
  const [loading, setLoading] = useState(false);

  async function recommend() {
    setLoading(true);
    try {
      const created = await api.post("/trips", trip);
      const tripId = created.data.data.id;
      const rec = await api.post(`/trips/${tripId}/recommend`);
      setTripId(tripId);
      setRecommendation(rec.data.data); // { trip, candidates }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8">
      <h2 className="font-bold text-2xl mb-6">Plan New Trip</h2>
      <div className="space-y-5">
        <input
          placeholder="Source"
          className="border rounded-lg p-3 w-full dark:bg-slate-700"
          onChange={(e) => setTrip({ ...trip, sourceAddress: e.target.value })}
        />
        <input
          placeholder="Destination"
          className="border rounded-lg p-3 w-full dark:bg-slate-700"
          onChange={(e) => setTrip({ ...trip, destinationAddress: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cargo Weight (kg)"
          className="border rounded-lg p-3 w-full dark:bg-slate-700"
          onChange={(e) => setTrip({ ...trip, cargoWeightKg: e.target.value })}
        />
        <button
          onClick={recommend}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Finding..." : "Find Best Assignment"}
        </button>
      </div>
    </div>
  );
}
