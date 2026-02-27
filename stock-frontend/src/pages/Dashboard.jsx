import { useEffect, useState } from "react";
import "../styles/dashboard.css";

import TradingViewChart from "../components/TradingViewChart";
import ActualVsPredicted from "../components/ActualVsPredicted";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const selectedStock = localStorage.getItem("last_stock");
  const [avpData, setAvpData] = useState([]);

  useEffect(() => {
    if (!selectedStock) {
      setAvpData([]);
      return;
    }

    fetch(`${API_BASE_URL}/actual-vs-predicted/${selectedStock}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvpData(data);
        } else {
          setAvpData([]);
        }
      })
      .catch(() => setAvpData([]));
  }, [selectedStock]);

  return (
    <div className="dashboard-page">
      <h1 className="dash-title">Dashboard</h1>

      {/* CANDLESTICK */}
      <div className="dash-card wide candle-hero">
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
      <div className="dash-card wide avp-section light-chart">
        <h3>Actual vs Predicted Price</h3>
        <ActualVsPredicted data={avpData} />
      </div>
    </div>
  );
}