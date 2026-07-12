import api from "../api/axios";

export default function RecommendationCard({ recommendation, tripId, onApproved }) {
  const best = recommendation?.candidates?.[0];

  async function approve() {
    await api.post(`/trips/${tripId}/approve`);
    onApproved?.();
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <h2 className="font-bold text-xl mb-5">AI Recommendation</h2>
      {best ? (
        <div className="space-y-3">
          <p>Driver ID <br /><b>{best.driverId}</b></p>
          <p>Vehicle ID <br /><b>{best.vehicleId}</b></p>
          <p>Score <br /><b>{best.score}</b></p>
          <p>Safety <br /><b>{best.breakdown.safetyScore}</b></p>
          <p>Route Familiarity <br /><b>{best.breakdown.familiarityScore}</b></p>
          <p>Load Fit <br /><b>{best.breakdown.loadFitScore}</b></p>
          <button onClick={approve} className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg">
            Approve Assignment
          </button>
        </div>
      ) : (
        <div className="text-gray-500">No recommendation yet.</div>
      )}
    </div>
  );
}
