import { useEffect, useState } from "react";
import api from "../api/axios";
import Heatmap from "../components/Heatmap";

export default function HeatmapPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/heatmap/month?year=2026&month=1")
      .then(res => setData(res.data));
  }, []);

  if (!data) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Heatmap</h1>
      <Heatmap activity={data.activity} />
    </div>
  );
}
