import { useEffect, useState } from "react";
import "../styles/dashboard.css";

import TradingViewChart from "../components/TradingViewChart";
import ActualVsPredicted from "../components/ActualVsPredicted";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const selectedStock = localStorage.getItem("last_stock");
  const [avpData, setAvpData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedStock) {
      setAvpData([]);
      return;
    }

    setLoading(true);

    fetch(`${API_BASE_URL}/actual-vs-predicted/${selectedStock}`)
      .then((res) => res.json())
      .then((data) => {
        setAvpData(Array.isArray(data) ? data : []);
      })
      .catch(() => setAvpData([]))
      .finally(() => setLoading(false));
  }, [selectedStock]);

  return (
    <div className="dashboard-page">
      <h1 className="dash-title">Dashboard</h1>

      <div className="dashboard-grid">
        {/* CANDLESTICK */}
        <div className="dash-card candle-hero">
          <h3>Candlestick Chart — {selectedStock || "N/A"}</h3>

          {!selectedStock ? (
            <p className="muted">
              Analyze a stock on Home page to view chart
            </p>
          ) : (
            <TradingViewChart symbol={selectedStock} />
          )}
        </div>

        {/* ACTUAL VS PREDICTED */}
        <div className="dash-card avp-section">
          <h3>Actual vs Predicted Price</h3>

          {loading ? (
            <p className="muted">Loading prediction...</p>
          ) : (
            <ActualVsPredicted data={avpData} />
          )}
        </div>
      </div>
    </div>
  );
}