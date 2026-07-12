import api from "../api/axios";

export default function ExportButton() {
  async function exportCSV() {
    const res = await api.get("/reports/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transitops-report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <button onClick={exportCSV} className="bg-green-600 text-white px-5 py-3 rounded-lg">
      Export CSV
    </button>
  );
}